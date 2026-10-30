
using Sprouty.Domain.Entities;
using System;
using System.Threading.Tasks;

namespace Sprouty.Application.Interfaces
{
    public interface ISensorProcessingRepository
    {
        Task<Sensor?> GetSensorWithLatestReadingAsync(Guid sensorId);

        Task SavePlantStatusAsync(PlantStatusRecord statusRecord);

        Task AddSensorReadingAsync(SensorReading reading);
    }
}
