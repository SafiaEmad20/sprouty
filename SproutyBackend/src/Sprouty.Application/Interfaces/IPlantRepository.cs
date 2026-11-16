using Sprouty.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;

namespace Sprouty.Application.Interfaces
{
    public interface IPlantRepository
    {
        Task<IEnumerable<Plant>> GetByUserIdAsync(Guid userId, CancellationToken cancellationToken = default);

        // Returns the plant only if it belongs to the given user.
        Task<Plant?> GetByIdForUserAsync(Guid id, Guid userId, CancellationToken cancellationToken = default);

        Task AddAsync(Plant plant, CancellationToken cancellationToken = default);

        void Remove(Plant plant);

        Task SaveChangesAsync(CancellationToken cancellationToken = default);
    }
}
