using Microsoft.EntityFrameworkCore;
using Sprouty.Application.Interfaces;
using Sprouty.Domain.Entities;
using Sprouty.Infrastructure.Persistence;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace Sprouty.Infrastructure.Repositories
{
    public class NotificationRepository : INotificationRepository
    {
        private readonly AppDbContext _context;

        public NotificationRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Notification>> GetByUserIdAsync(Guid userId, bool unreadOnly = false, CancellationToken cancellationToken = default)
        {
            var query = _context.Notifications
                .AsNoTracking()
                .Include(n => n.Plant)
                .Where(n => n.Plant.UserId == userId);

            if (unreadOnly)
            {
                query = query.Where(n => !n.IsRead);
            }

            return await query
                .OrderByDescending(n => n.CreatedAt)
                .ToListAsync(cancellationToken);
        }

        public async Task<int> CountUnreadAsync(Guid userId, CancellationToken cancellationToken = default)
        {
            return await _context.Notifications
                .CountAsync(n => n.Plant.UserId == userId && !n.IsRead, cancellationToken);
        }

        public async Task<List<Notification>> GetUnreadByUserIdAsync(Guid userId, CancellationToken cancellationToken = default)
        {
            return await _context.Notifications
                .Where(n => n.Plant.UserId == userId && !n.IsRead)
                .ToListAsync(cancellationToken);
        }

        public void Remove(Notification notification)
        {
            _context.Notifications.Remove(notification);
        }

        public async Task<Notification?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default)
        {
            return await _context.Notifications
                .Include(n => n.Plant)
                .FirstOrDefaultAsync(n => n.Id == id, cancellationToken);
        }

        public async Task AddAsync(Notification notification, CancellationToken cancellationToken = default)
        {
            await _context.Notifications.AddAsync(notification, cancellationToken);
        }

        public async Task SaveChangesAsync(CancellationToken cancellationToken = default)
        {
            await _context.SaveChangesAsync(cancellationToken);
        }
    }
}