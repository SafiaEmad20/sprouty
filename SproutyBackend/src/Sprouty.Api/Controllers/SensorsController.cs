
using Microsoft.AspNetCore.Mvc;
using Sprouty.Application.DTOs.Sensors;
using Sprouty.Application.Interfaces;

namespace Sprouty.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class SensorsController : ControllerBase
    {
        private readonly ISensorProcessingService _sensorProcessingService;

        public SensorsController(
            ISensorProcessingService sensorProcessingService)
        {
            _sensorProcessingService = sensorProcessingService;
        }

        [HttpPost("{sensorId:guid}/readings")]
        public async Task<IActionResult> AddReading(
            Guid sensorId,
            AddSensorReadingRequestDto request)
        {
            await _sensorProcessingService.AddReadingAsync(
                sensorId, request);

            return NoContent();
        }

        [HttpPost("{sensorId:guid}/process")]
        public async Task<IActionResult> ProcessReading(Guid sensorId)
        {
            var result = await _sensorProcessingService
                .ProcessReadingAsync(sensorId);

            return Ok(result);
        }
    }
}
