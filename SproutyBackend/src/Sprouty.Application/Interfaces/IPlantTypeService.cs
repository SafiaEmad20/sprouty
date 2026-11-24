using Sprouty.Application.DTOs.PlantTypes;
using System;
using System.Collections.Generic;
using System.Text;

namespace Sprouty.Application.Interfaces
{
    public interface IPlantTypeService
    {
        Task<IEnumerable<PlantTypeResponseDto>> GetAllAsync( CancellationToken cancellationToken = default);

        Task<PlantTypeResponseDto?> GetByIdAsync( Guid id, CancellationToken cancellationToken = default);

        // Search by English or Arabic name (and category), best matches first. Tolerates small typos.
        Task<IEnumerable<PlantTypeResponseDto>> SearchAsync(string? query, CancellationToken cancellationToken = default);
    }
}
