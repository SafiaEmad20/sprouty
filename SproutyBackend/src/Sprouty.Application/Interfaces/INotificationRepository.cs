using Sprouty.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;

namespace Sprouty.Application.Interfaces
{
    public interface INotificationRepository
    {
        Task<IEnumerable<Notification>> GetByUserIdAsync(Guid userId, bool unreadOnly = false, CancellationToken cancellationToken = default);

        Task<int> CountUnreadAsync(Guid userId, CancellationToken cancellationToken = default);

        // Tracked, so the service can mark them as read.
        Task<List<Notification>> GetUnreadByUserIdAsync(Guid userId, CancellationToken cancellationToken = default);

        void Remove(Notification notification);

        Task<Notification?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default);

        Task AddAsync(Notification notification, CancellationToken cancellationToken = default);

        Task SaveChangesAsync(CancellationToken cancellationToken = default);
    }
}