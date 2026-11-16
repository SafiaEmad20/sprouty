using Microsoft.EntityFrameworkCore;
using Sprouty.Application.Interfaces;
using Sprouty.Domain.Entities;
using Sprouty.Infrastructure.Persistence;

namespace Sprouty.Infrastructure.Repositories
{
    public class PlantRepository : IPlantRepository
    {
        private readonly AppDbContext _context;

        public PlantRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Plant>> GetByUserIdAsync(
            Guid userId,
            CancellationToken cancellationToken = default)
        {
            return await _context.Plants
                .AsNoTracking()
                .Include(p => p.PlantType)
                .Include(p => p.Sensors)
                .Where(p => p.UserId == userId)
                .OrderByDescending(p => p.AddedAt)
                .ToListAsync(cancellationToken);
        }

        // Tracked, so the service can update or delete the returned plant.
        public async Task<Plant?> GetByIdForUserAsync(
            Guid id,
            Guid userId,
            CancellationToken cancellationToken = default)
        {
            return await _context.Plants
                .Include(p => p.PlantType)
                .Include(p => p.Sensors)
                .FirstOrDefaultAsync(p => p.Id == id && p.UserId == userId, cancellationToken);
        }

        public async Task AddAsync(
            Plant plant,
            CancellationToken cancellationToken = default)
        {
            await _context.Plants.AddAsync(plant, cancellationToken);
        }

        public void Remove(Plant plant)
        {
            _context.Plants.Remove(plant);
        }

        public async Task RemoveHistoryAsync(
            Guid plantId,
            CancellationToken cancellationToken = default)
        {
            var readings = await _context.SensorReadings
                .Where(r => r.Sensor.PlantId == plantId)
                .ToListAsync(cancellationToken);

            var statuses = await _context.PlantStatuses
                .Where(s => s.PlantId == plantId)
                .ToListAsync(cancellationToken);

            var notifications = await _context.Notifications
                .Where(n => n.PlantId == plantId)
                .ToListAsync(cancellationToken);

            _context.SensorReadings.RemoveRange(readings);
            _context.PlantStatuses.RemoveRange(statuses);
            _context.Notifications.RemoveRange(notifications);
        }

        public async Task SaveChangesAsync(
            CancellationToken cancellationToken = default)
        {
            await _context.SaveChangesAsync(cancellationToken);
        }
    }
}
