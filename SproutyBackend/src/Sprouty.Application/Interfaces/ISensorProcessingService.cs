using Sprouty.Application.DTOs.Sensors;
using System;
using System.Threading.Tasks;

namespace Sprouty.Application.Interfaces
{
    public interface ISensorProcessingService
    {
        Task<PlantStatusResponseDto> ProcessReadingAsync(Guid sensorId);

        Task AddReadingAsync(Guid sensorId, AddSensorReadingRequestDto request);
    }
}