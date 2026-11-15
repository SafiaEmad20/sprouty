using System;

namespace Sprouty.Application.DTOs.Notifications
{
    public class NotificationResponseDto
    {
        public Guid Id { get; set; }
        public Guid PlantId { get; set; }
        public string PlantNickname { get; set; } = string.Empty;
        public string Title { get; set; } = string.Empty;
        public string Message { get; set; } = string.Empty;
        public string Type { get; set; } = string.Empty;
        public bool IsRead { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}