using System.ComponentModel.DataAnnotations;

namespace Sprouty.Application.DTOs.Sensors
{
    // القيم الأربعة لازم تتبعت كلها؛ لو واحدة ناقصة الـAPI يرجع 400 بدل ما يحفظها صفر.
    public class AddSensorReadingRequestDto
    {
        [Required(ErrorMessage = "Moisture is required.")]
        public double? Moisture { get; set; }

        [Required(ErrorMessage = "Temperature is required.")]
        public double? Temperature { get; set; }

        [Required(ErrorMessage = "Humidity is required.")]
        public double? Humidity { get; set; }

        // Raw LDR value from 0 to 4095 (higher = darker).
        [Required(ErrorMessage = "Light is required.")]
        public double? Light { get; set; }
    }
}
