using System;
using System.Collections.Generic;
using System.Text;

namespace Sprouty.Application.DTOs.PlantTypes
{
    public class PlantTypeResponseDto
    {
        public Guid Id { get; set; }

        public string NameAr { get; set; } = string.Empty;

        public string NameEn { get; set; } = string.Empty;

        public string Category { get; set; } = string.Empty;

        public string? ImageUrl { get; set; }

        public PlantRequirementResponseDto? Requirement { get; set; }
    }
}
