using Microsoft.EntityFrameworkCore;
using Sprouty.Application.Interfaces;
using Sprouty.Domain.Entities;
using Sprouty.Infrastructure.Persistence;

namespace Sprouty.Infrastructure.Repositories
{
    public class PlantReadingRepository : IPlantReadingRepository
    {
        private readonly AppDbContext _context;

        public PlantReadingRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<List<SensorReading>> GetLatestReadingsAsync(
            Guid plantId,
            int limit,
            CancellationToken cancellationToken = default)
        {
            var readings = await _context.SensorReadings
                .AsNoTracking()
                .Where(r => r.Sensor.PlantId == plantId)
                .OrderByDescending(r => r.RecordedAt)
                .Take(limit)
                .ToListAsync(cancellationToken);

            // Oldest first, so the history can be drawn left to right.
            readings.Reverse();

            return readings;
        }

        public async Task<SensorReading?> GetLatestReadingAsync(
            Guid plantId,
            CancellationToken cancellationToken = default)
        {
            return await _context.SensorReadings
                .AsNoTracking()
                .Where(r => r.Sensor.PlantId == plantId)
                .OrderByDescending(r => r.RecordedAt)
                .FirstOrDefaultAsync(cancellationToken);
        }

        public async Task<PlantStatusRecord?> GetLatestStatusAsync(
            Guid plantId,
            CancellationToken cancellationToken = default)
        {
            return await _context.PlantStatuses
                .AsNoTracking()
                .Where(s => s.PlantId == plantId)
                .OrderByDescending(s => s.ComputedAt)
                .FirstOrDefaultAsync(cancellationToken);
        }
    }
}
