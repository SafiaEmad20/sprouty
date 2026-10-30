
using Sprouty.Domain.Enums;
using System;

namespace Sprouty.Application.DTOs.Sensors
{
    public class PlantStatusResponseDto
    {
        public Guid PlantId { get; set; }

        public PlantStatus Status { get; set; }

        public string Message { get; set; } = string.Empty;

        public DateTime ComputedAt { get; set; }
    }
}
