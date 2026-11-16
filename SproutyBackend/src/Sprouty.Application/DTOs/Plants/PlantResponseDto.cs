using System;

namespace Sprouty.Application.DTOs.Plants
{
    public class PlantResponseDto
    {
        public Guid Id { get; set; }
        public Guid UserId { get; set; }
        public Guid PlantTypeId { get; set; }
        public string PlantTypeNameAr { get; set; } = string.Empty;
        public string PlantTypeNameEn { get; set; } = string.Empty;
        public string Nickname { get; set; } = string.Empty;
        public string? ImageUrl { get; set; }
        public DateTime AddedAt { get; set; }

        // The sensor created with the plant; used to send readings for it.
        public Guid? SensorId { get; set; }
    }
}
