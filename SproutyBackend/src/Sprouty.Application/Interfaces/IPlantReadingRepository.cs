using Sprouty.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;

namespace Sprouty.Application.Interfaces
{
    public interface IPlantReadingRepository
    {
        // The latest readings of all the plant's sensors, ordered oldest to newest.
        Task<List<SensorReading>> GetLatestReadingsAsync(Guid plantId, int limit, CancellationToken cancellationToken = default);

        Task<SensorReading?> GetLatestReadingAsync(Guid plantId, CancellationToken cancellationToken = default);

        Task<PlantStatusRecord?> GetLatestStatusAsync(Guid plantId, CancellationToken cancellationToken = default);
    }
}
