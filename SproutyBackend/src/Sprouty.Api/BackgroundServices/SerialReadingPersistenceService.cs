using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Sprouty.Application.DTOs.Sensors;
using Sprouty.Application.Interfaces;
using Sprouty.Infrastructure.Services;

namespace Sprouty.Api.BackgroundServices;

public sealed class SerialReadingPersistenceService : BackgroundService
{
    private readonly ILogger<SerialReadingPersistenceService> _logger;
    private readonly IConfiguration _configuration;
    private readonly ISensorReadingStore _readingStore;
    private readonly IServiceScopeFactory _scopeFactory;

    public SerialReadingPersistenceService(
        ILogger<SerialReadingPersistenceService> logger,
        IConfiguration configuration,
        ISensorReadingStore readingStore,
        IServiceScopeFactory scopeFactory)
    {
        _logger = logger;
        _configuration = configuration;
        _readingStore = readingStore;
        _scopeFactory = scopeFactory;
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        bool enabled = bool.TryParse(_configuration["SerialIngestion:Enabled"], out bool isEnabled) && isEnabled;
        if (!enabled)
        {
            _logger.LogInformation("SerialReadingPersistenceService is disabled in configuration.");
            return;
        }

        if (!Guid.TryParse(_configuration["SerialIngestion:PlantId"], out Guid plantId) || plantId == Guid.Empty ||
            !Guid.TryParse(_configuration["SerialIngestion:UserId"], out Guid userId) || userId == Guid.Empty)
        {
            _logger.LogWarning("SerialIngestion requires valid non-empty PlantId and UserId GUIDs in configuration.");
            return;
        }

        int intervalSeconds = int.TryParse(_configuration["SerialIngestion:IntervalSeconds"], out int sec) && sec > 0
            ? sec
            : 30;

        DateTime? lastSavedTimestamp = null;

        while (!stoppingToken.IsCancellationRequested)
        {
            try
            {
                await Task.Delay(TimeSpan.FromSeconds(intervalSeconds), stoppingToken);

                var latest = _readingStore.LatestReading;
                if (latest is null)
                    continue;

                if (lastSavedTimestamp.HasValue && latest.ReceivedAtUtc <= lastSavedTimestamp.Value)
                    continue;

                var request = new AddSensorReadingRequestDto
                {
                    Moisture = latest.SoilPercent,
                    Temperature = latest.Temperature,
                    Humidity = latest.Humidity,
                    Light = latest.LdrRaw
                };

                using var scope = _scopeFactory.CreateScope();
                var plantReadingService = scope.ServiceProvider.GetRequiredService<IPlantReadingService>();

                await plantReadingService.AddReadingAsync(plantId, userId, request, stoppingToken);
                lastSavedTimestamp = latest.ReceivedAtUtc;

                _logger.LogInformation(
                    "Persisted reading for Plant {PlantId} -> Moisture: {Moisture}%, Temp: {Temp}, Hum: {Hum}, Light(Raw): {Light}",
                    plantId, request.Moisture, request.Temperature, request.Humidity, request.Light);
            }
            catch (OperationCanceledException) when (stoppingToken.IsCancellationRequested)
            {
                break;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error persisting sensor reading from serial store.");
            }
        }
    }
}