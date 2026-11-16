using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Sprouty.Application.DTOs.Readings;
using Sprouty.Application.DTOs.Sensors;
using Sprouty.Application.Interfaces;
using Sprouty.Application.Services;
using System;
using System.Collections.Generic;
using System.Security.Claims;
using System.Threading;
using System.Threading.Tasks;

namespace Sprouty.Api.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/plants/{plantId:guid}")]
    public class PlantReadingsController : ControllerBase
    {
        private readonly IPlantReadingService _plantReadingService;

        public PlantReadingsController(IPlantReadingService plantReadingService)
        {
            _plantReadingService = plantReadingService;
        }

        // تاريخ القراءات (آخر limit قراءة، من الأقدم للأحدث)
        [HttpGet("readings")]
        public async Task<ActionResult<IEnumerable<SensorReadingResponseDto>>> GetReadings(
            Guid plantId,
            [FromQuery] int limit = PlantReadingService.DefaultLimit,
            CancellationToken cancellationToken = default)
        {
            var userId = GetCurrentUserId();
            var readings = await _plantReadingService.GetReadingsAsync(plantId, userId, limit, cancellationToken);
            return Ok(readings);
        }

        // آخر قراءة مع المدى المثالي وحالة النبتة
        [HttpGet("latest")]
        public async Task<ActionResult<PlantLatestReadingResponseDto>> GetLatest(
            Guid plantId,
            CancellationToken cancellationToken)
        {
            var userId = GetCurrentUserId();
            var latest = await _plantReadingService.GetLatestAsync(plantId, userId, cancellationToken);
            return Ok(latest);
        }

        // إضافة قراءة للنبتة (وبعدها الحالة بتتحسب تلقائي)
        [HttpPost("readings")]
        public async Task<ActionResult<AddPlantReadingResponseDto>> AddReading(
            Guid plantId,
            AddSensorReadingRequestDto request,
            CancellationToken cancellationToken)
        {
            var userId = GetCurrentUserId();
            var result = await _plantReadingService.AddReadingAsync(plantId, userId, request, cancellationToken);
            return CreatedAtAction(nameof(GetLatest), new { plantId }, result);
        }

        private Guid GetCurrentUserId()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value
                           ?? User.FindFirst("sub")?.Value;

            if (string.IsNullOrEmpty(userIdClaim) || !Guid.TryParse(userIdClaim, out var userId))
            {
                throw new UnauthorizedAccessException("User ID claim is missing or invalid.");
            }

            return userId;
        }
    }
}
