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

        public async Task SaveChangesAsync(
            CancellationToken cancellationToken = default)
        {
            await _context.SaveChangesAsync(cancellationToken);
        }
    }
}
