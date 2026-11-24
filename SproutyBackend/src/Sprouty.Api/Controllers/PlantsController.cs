using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Sprouty.Application.DTOs.Plants;
using Sprouty.Application.Interfaces;
using System;
using System.Collections.Generic;
using System.Security.Claims;
using System.Threading;
using System.Threading.Tasks;

namespace Sprouty.Api.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class PlantsController : ControllerBase
    {
        private readonly IPlantService _plantService;

        public PlantsController(IPlantService plantService)
        {
            _plantService = plantService;
        }

        // عرض نباتات المستخدم الحالي
        [HttpGet]
        // GET /api/plants?search=min  → filters by nickname or plant type (optional).
        public async Task<ActionResult<IEnumerable<PlantResponseDto>>> GetMyPlants(
            [FromQuery] string? search,
            CancellationToken cancellationToken)
        {
            var userId = GetCurrentUserId();
            var plants = await _plantService.GetUserPlantsAsync(userId, search, cancellationToken);
            return Ok(plants);
        }

        // عرض نبتة واحدة
        [HttpGet("{id:guid}")]
        public async Task<ActionResult<PlantResponseDto>> GetById(
            Guid id,
            CancellationToken cancellationToken)
        {
            var userId = GetCurrentUserId();
            var plant = await _plantService.GetByIdAsync(id, userId, cancellationToken);
            return Ok(plant);
        }

        // إضافة نبتة جديدة
        [HttpPost]
        public async Task<ActionResult<PlantResponseDto>> Create(
            CreatePlantRequestDto request,
            CancellationToken cancellationToken)
        {
            var userId = GetCurrentUserId();
            var plant = await _plantService.CreateAsync(userId, request, cancellationToken);
            return CreatedAtAction(nameof(GetById), new { id = plant.Id }, plant);
        }

        // تعديل نبتة
        [HttpPut("{id:guid}")]
        public async Task<ActionResult<PlantResponseDto>> Update(
            Guid id,
            UpdatePlantRequestDto request,
            CancellationToken cancellationToken)
        {
            var userId = GetCurrentUserId();
            var plant = await _plantService.UpdateAsync(id, userId, request, cancellationToken);
            return Ok(plant);
        }

        // حذف نبتة
        [HttpDelete("{id:guid}")]
        public async Task<IActionResult> Delete(
            Guid id,
            CancellationToken cancellationToken)
        {
            var userId = GetCurrentUserId();
            await _plantService.DeleteAsync(id, userId, cancellationToken);
            return NoContent();
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
