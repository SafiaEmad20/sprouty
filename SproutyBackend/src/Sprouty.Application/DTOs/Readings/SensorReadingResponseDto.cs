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
        public double Light { get; set; }
        public DateTime RecordedAt { get; set; }
    }
}
