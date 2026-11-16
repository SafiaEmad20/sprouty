using Sprouty.Application.DTOs.Readings;
using Sprouty.Application.DTOs.Sensors;
using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;

namespace Sprouty.Application.Interfaces
{
    public interface IPlantReadingService
    {
        Task<IEnumerable<SensorReadingResponseDto>> GetReadingsAsync(Guid plantId, Guid userId, int limit, CancellationToken cancellationToken = default);

        Task<PlantLatestReadingResponseDto> GetLatestAsync(Guid plantId, Guid userId, CancellationToken cancellationToken = default);

        Task<AddPlantReadingResponseDto> AddReadingAsync(Guid plantId, Guid userId, AddSensorReadingRequestDto request, CancellationToken cancellationToken = default);
    }
}
