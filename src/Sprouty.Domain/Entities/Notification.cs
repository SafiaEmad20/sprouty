using Sprouty.Domain.Enums;

namespace Sprouty.Domain.Entities
{
    public class Notification
    {
        public Guid Id { get; set; }
        public Guid PlantId { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Message { get; set; } = string.Empty;
        public string Type { get; set; }
        public bool IsRead { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public Plant Plant { get; set; } = null!;
    }
}