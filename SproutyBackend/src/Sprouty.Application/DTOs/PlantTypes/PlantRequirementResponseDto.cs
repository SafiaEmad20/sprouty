using System;
using System.Collections.Generic;
using System.Text;

namespace Sprouty.Application.DTOs.PlantTypes
{
    public class PlantRequirementResponseDto
    {
        public float MinMoisture { get; set; }
        public float MaxMoisture { get; set; }

        public float MinTemperature { get; set; }
        public float MaxTemperature { get; set; }

        public float MinHumidity { get; set; }
        public float MaxHumidity { get; set; }

        public float MinLight { get; set; }
        public float MaxLight { get; set; }
    }
}
