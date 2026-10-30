
namespace Sprouty.Application.DTOs.Sensors
{
    public class AddSensorReadingRequestDto
    {
        public double Moisture { get; set; }

        public double Temperature { get; set; }

        public double Humidity { get; set; }

        public double Light { get; set; }
    }
}
