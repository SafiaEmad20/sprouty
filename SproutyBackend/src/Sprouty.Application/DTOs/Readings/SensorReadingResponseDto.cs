using System;

namespace Sprouty.Application.DTOs.Readings
{
    public class SensorReadingResponseDto
    {
        public Guid Id { get; set; }
        public Guid SensorId { get; set; }
        public double Moisture { get; set; }
        public double Temperature { get; set; }
        public double Humidity { get; set; }
        // Raw LDR value as stored (0–4095, higher = darker).
        public double Light { get; set; }
        // The same light as a percentage (0 = dark, 100 = bright), the unit of MinLight/MaxLight.
        public double LightLevel { get; set; }
        public DateTime RecordedAt { get; set; }
    }
}
