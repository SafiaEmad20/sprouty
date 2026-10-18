using Sprouty.Domain.Enums;
using System;
using System.Collections.Generic;
using System.Text;

namespace Sprouty.Domain.Entities
{

    public class Sensor
    {
        public Guid Id { get; set; }
        public Guid PlantId { get; set; }
        public string DeviceCode { get; set; } = string.Empty;
        public SensorStatus Status { get; set; } = SensorStatus.Active;
        public DateTime? LastSeenAt { get; set; }

        public Plant Plant { get; set; } = null!;
        public ICollection<SensorReading> Readings { get; set; } = new List<SensorReading>();
    }
}
