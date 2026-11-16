using Sprouty.Application.DTOs.Readings;
using Sprouty.Application.DTOs.Sensors;
using System;
using System.Threading.Tasks;

namespace Sprouty.Application.Interfaces
{
    public interface ISensorProcessingService
    {
        Task<PlantStatusResponseDto> ProcessReadingAsync(Guid sensorId);

        Task<SensorReadingResponseDto> AddReadingAsync(Guid sensorId, AddSensorReadingRequestDto request);
    }
}