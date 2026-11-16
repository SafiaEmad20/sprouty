using Sprouty.Application.DTOs.Sensors;

namespace Sprouty.Application.DTOs.Readings
{
    public class AddPlantReadingResponseDto
    {
        public SensorReadingResponseDto Reading { get; set; } = null!;

        // The plant status computed from this reading.
        public PlantStatusResponseDto Status { get; set; } = null!;
    }
}
