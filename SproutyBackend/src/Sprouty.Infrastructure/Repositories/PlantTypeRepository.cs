
using Microsoft.EntityFrameworkCore;
using Sprouty.Application.Interfaces;
using Sprouty.Domain.Entities;
using Sprouty.Infrastructure.Persistence;

namespace Sprouty.Infrastructure.Repositories
{
    public class PlantTypeRepository : IPlantTypeRepository
    {
        private readonly AppDbContext _context;

        public PlantTypeRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<PlantType>> GetAllAsync(
            CancellationToken cancellationToken = default)
        {
            return await _context.PlantTypes
                .AsNoTracking()
                .Include(p => p.Requirement)
                .ToListAsync(cancellationToken);
        }

        public async Task<PlantType?> GetByIdAsync(
            Guid id,
            CancellationToken cancellationToken = default)
        {
            return await _context.PlantTypes
                .AsNoTracking()
                .Include(p => p.Requirement)
                .FirstOrDefaultAsync(p => p.Id == id, cancellationToken);
        }
    }

}