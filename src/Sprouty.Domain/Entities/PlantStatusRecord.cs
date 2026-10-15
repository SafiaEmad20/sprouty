using Sprouty.Domain.Enums;

namespace Sprouty.Domain.Entities
{

    public class PlantStatusRecord        //plant_statuses
    {
        public Guid Id { get; set; }
        public Guid PlantId { get; set; }
        public PlantStatus StatusType { get; set; }
        public string Message { get; set; } = string.Empty;  
        public DateTime ComputedAt { get; set; } = DateTime.UtcNow;

        public Plant Plant { get; set; } = null!;
    }
}