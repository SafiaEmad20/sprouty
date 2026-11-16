using Sprouty.Application.DTOs.PlantTypes;
using Sprouty.Application.DTOs.Sensors;
using System;

namespace Sprouty.Application.DTOs.Readings
{
    public class PlantLatestReadingResponseDto
    {
        public Guid PlantId { get; set; }

        // null when the plant has no readings yet.
        public SensorReadingResponseDto? Reading { get; set; }

        // The ideal ranges for this plant's type.
        public PlantRequirementResponseDto? Requirement { get; set; }

        // The last computed status; null when no status was computed yet.
        public PlantStatusResponseDto? Status { get; set; }
    }
}
