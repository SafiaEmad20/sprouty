using System.Text.Json.Serialization;

namespace Sprouty.Infrastructure.Services;

public sealed class SensorReadingDto
{
    [JsonPropertyName("temperature")]
    public double Temperature { get; set; }

    [JsonPropertyName("humidity")]
    public double Humidity { get; set; }

    [JsonPropertyName("ldrRaw")]
    public int LdrRaw { get; set; }

    [JsonPropertyName("lightLevel")]
    public int LightLevel { get; set; }

    [JsonPropertyName("soilRaw")]
    public int SoilRaw { get; set; }

    [JsonPropertyName("soilPercent")]
    public int SoilPercent { get; set; }

    public DateTime ReceivedAtUtc { get; set; } = DateTime.UtcNow;
}

public interface ISensorReadingStore
{
    SensorReadingDto? LatestReading { get; }
    void Update(SensorReadingDto reading);
}

public sealed class InMemorySensorReadingStore : ISensorReadingStore
{
    private readonly object _lock = new();
    private SensorReadingDto? _latest;

    public SensorReadingDto? LatestReading
    {
        get
        {
            lock (_lock)
            {
                return _latest;
            }
        }
    }

    public void Update(SensorReadingDto reading)
    {
        lock (_lock)
        {
            reading.ReceivedAtUtc = DateTime.UtcNow;
            _latest = reading;
        }
    }
}
