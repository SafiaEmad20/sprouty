namespace Sprouty.Domain.Entities
{

    public class Plant
    {
        public Guid Id { get; set; }
        public Guid UserId { get; set; }
        public Guid PlantTypeId { get; set; }
        public string Nickname { get; set; } = string.Empty;
        public string? ImageUrl { get; set; }
        public DateTime AddedAt { get; set; } = DateTime.UtcNow;

        public User User { get; set; } = null!;
        public PlantType PlantType { get; set; } = null!;
        public ICollection<Sensor> Sensors { get; set; } = new List<Sensor>();
        public ICollection<PlantStatusRecord> StatusHistory { get; set; } = new List<PlantStatusRecord>();
        public ICollection<Notification> Notifications { get; set; } = new List<Notification>();
    }
}