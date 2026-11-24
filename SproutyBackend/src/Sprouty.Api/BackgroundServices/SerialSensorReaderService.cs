using System.IO.Ports;
using System.Text.Json;
using Sprouty.Infrastructure.Services;

namespace Sprouty.Api.BackgroundServices;

public sealed class SerialSensorReaderService : BackgroundService
{
    private readonly ILogger<SerialSensorReaderService> _logger;
    private readonly IConfiguration _configuration;
    private readonly ISensorReadingStore _readingStore;

    private static readonly JsonSerializerOptions JsonOptions = new()
    {
        PropertyNameCaseInsensitive = true
    };

    public SerialSensorReaderService(
        ILogger<SerialSensorReaderService> logger,
        IConfiguration configuration,
        ISensorReadingStore readingStore)
    {
        _logger = logger;
        _configuration = configuration;
        _readingStore = readingStore;
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        string portName = _configuration["SerialPort:PortName"] ?? "COM3";
        int baudRate = int.TryParse(_configuration["SerialPort:BaudRate"], out int b) ? b : 115200;
        int readTimeout = int.TryParse(_configuration["SerialPort:ReadTimeoutMs"], out int t) ? t : 5000;

        while (!stoppingToken.IsCancellationRequested)
        {
            using var serialPort = new SerialPort(portName, baudRate)
            {
                NewLine = "\n",
                ReadTimeout = readTimeout
            };

            try
            {
                serialPort.Open();
                _logger.LogInformation("Opened serial port {PortName} at {BaudRate} baud.", portName, baudRate);

                while (!stoppingToken.IsCancellationRequested && serialPort.IsOpen)
                {
                    string? line;
                    try
                    {
                        line = await Task.Run(() => serialPort.ReadLine(), stoppingToken);
                    }
                    catch (TimeoutException)
                    {
                        continue;
                    }

                    if (string.IsNullOrWhiteSpace(line))
                        continue;

                    string trimmed = line.Trim();
                    if (!trimmed.StartsWith('{'))
                        continue;

                    try
                    {
                        var dto = JsonSerializer.Deserialize<SensorReadingDto>(trimmed, JsonOptions);
                        if (dto is not null)
                        {
                            _readingStore.Update(dto);
                            _logger.LogInformation(
                                "Sensor reading updated -> Temp: {Temp}, Hum: {Hum}, LDR: {Ldr}, Soil: {SoilRaw} ({SoilPct}%)",
                                dto.Temperature, dto.Humidity, dto.LdrRaw, dto.SoilRaw, dto.SoilPercent);
                        }
                    }
                    catch (JsonException ex)
                    {
                        _logger.LogWarning(ex, "Failed to parse JSON line: {Line}", trimmed);
                    }
                }
            }
            catch (OperationCanceledException) when (stoppingToken.IsCancellationRequested)
            {
                break;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Serial port error on {PortName}. Retrying in 3 seconds...", portName);
                await Task.Delay(TimeSpan.FromSeconds(3), stoppingToken);
            }
        }
    }
}