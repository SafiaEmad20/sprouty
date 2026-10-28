using Sprouty.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Text;

namespace Sprouty.Application.Interfaces
{
    public interface IPlantTypeRepository
    {
        Task<IEnumerable<PlantType>> GetAllAsync(CancellationToken cancellationToken = default);

        Task<PlantType?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default);
    }
}
