using System;
using System.ComponentModel.DataAnnotations;

namespace Sprouty.Application.DTOs.Plants
{
    public class UpdatePlantRequestDto
    {
        [Required]
        public Guid PlantTypeId { get; set; }

        [Required]
        [StringLength(100, MinimumLength = 1)]
        public string Nickname { get; set; } = string.Empty;

        [StringLength(500)]
        public string? ImageUrl { get; set; }
    }
}
