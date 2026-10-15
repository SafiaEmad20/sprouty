using System;
using System.Collections.Generic;
using System.Text;

namespace Sprouty.Domain.Entities
{
    public class SensorReading
    {
        public Guid Id { get; set; }
        public Guid SensorId { get; set; }

        public double Moisture { get; set; }
        public double Temperature { get; set; }
        public double Humidity { get; set; }
        public double Light { get; set; }
        public DateTime RecordedAt { get; set; } = DateTime.UtcNow;

        public Sensor Sensor { get; set; } = null!;
    }
}
