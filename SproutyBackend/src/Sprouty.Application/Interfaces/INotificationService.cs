using Sprouty.Application.DTOs.Notifications;
using Sprouty.Domain.Enums;


namespace Sprouty.Application.Interfaces
{
    public interface INotificationService
    {
        Task<IEnumerable<NotificationResponseDto>> GetUserNotificationsAsync(Guid userId, CancellationToken cancellationToken = default);

        Task MarkAsReadAsync(Guid notificationId, Guid userId, CancellationToken cancellationToken = default);

        Task CreateNotificationAsync(Guid plantId, string title, string message, NotificationType type, CancellationToken cancellationToken = default);
    }
}