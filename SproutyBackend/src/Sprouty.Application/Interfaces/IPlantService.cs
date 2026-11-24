using Sprouty.Application.DTOs.Plants;
using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;

namespace Sprouty.Application.Interfaces
{
    public interface IPlantService
    {
        // search (optional): filters by nickname or plant type name, best matches first.
        Task<IEnumerable<PlantResponseDto>> GetUserPlantsAsync(Guid userId, string? search = null, CancellationToken cancellationToken = default);

        Task<PlantResponseDto> GetByIdAsync(Guid id, Guid userId, CancellationToken cancellationToken = default);

        Task<PlantResponseDto> CreateAsync(Guid userId, CreatePlantRequestDto request, CancellationToken cancellationToken = default);

        Task<PlantResponseDto> UpdateAsync(Guid id, Guid userId, UpdatePlantRequestDto request, CancellationToken cancellationToken = default);

        Task DeleteAsync(Guid id, Guid userId, CancellationToken cancellationToken = default);
    }
}
