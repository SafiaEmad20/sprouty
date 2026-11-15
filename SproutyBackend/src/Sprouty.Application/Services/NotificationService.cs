using Sprouty.Application.DTOs.Notifications;
using Sprouty.Application.Exceptions;
using Sprouty.Application.Interfaces;
using Sprouty.Domain.Entities;
using Sprouty.Domain.Enums;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace Sprouty.Application.Services
{
    public class NotificationService : INotificationService
    {
        private readonly INotificationRepository _notificationRepository;

        public NotificationService(INotificationRepository notificationRepository)
        {
            _notificationRepository = notificationRepository;
        }

        public async Task<IEnumerable<NotificationResponseDto>> GetUserNotificationsAsync(
            Guid userId,
            CancellationToken cancellationToken = default)
        {
            var notifications = await _notificationRepository.GetByUserIdAsync(userId, cancellationToken);

            return notifications.Select(n => new NotificationResponseDto
            {
                Id = n.Id,
                PlantId = n.PlantId,
                PlantNickname = n.Plant?.Nickname ?? string.Empty,
                Title = n.Title,
                Message = n.Message,
                Type = n.Type,
                IsRead = n.IsRead,
                CreatedAt = n.CreatedAt
            });
        }

        public async Task MarkAsReadAsync(
            Guid notificationId,
            Guid userId,
            CancellationToken cancellationToken = default)
        {
            var notification = await _notificationRepository.GetByIdAsync(notificationId, cancellationToken);

            if (notification == null || notification.Plant == null || notification.Plant.UserId != userId)
            {
                throw new NotFoundException("Notification not found.");
            }

            if (!notification.IsRead)
            {
                notification.IsRead = true;
                await _notificationRepository.SaveChangesAsync(cancellationToken);
            }
        }

        public async Task CreateNotificationAsync(
            Guid plantId,
            string title,
            string message,
            NotificationType type,
            CancellationToken cancellationToken = default)
        {
            var notification = new Notification
            {
                Id = Guid.NewGuid(),
                PlantId = plantId,
                Title = title,
                Message = message,
                Type = type.ToString(),
                IsRead = false,
                CreatedAt = DateTime.UtcNow
            };

            await _notificationRepository.AddAsync(notification, cancellationToken);
            await _notificationRepository.SaveChangesAsync(cancellationToken);
        }
    }
}