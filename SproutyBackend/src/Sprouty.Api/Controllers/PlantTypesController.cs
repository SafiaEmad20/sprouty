
using Microsoft.AspNetCore.Mvc;
using Sprouty.Application.Interfaces;

namespace Sprouty.Api.Controllers
{

    [ApiController]
    [Route("api/plant-types")]
    public class PlantTypesController : ControllerBase
    {
        private readonly IPlantTypeService _plantTypeService;

        public PlantTypesController(IPlantTypeService plantTypeService)
        {
            _plantTypeService = plantTypeService;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll(
            CancellationToken cancellationToken)
        {
            var plantTypes = await _plantTypeService.GetAllAsync(cancellationToken);

            return Ok(plantTypes);
        }

        [HttpGet("{id:guid}")]
        public async Task<IActionResult> GetById(Guid id, CancellationToken cancellationToken)
        {
            var plantType = await _plantTypeService.GetByIdAsync( id, cancellationToken);

            if (plantType is null)
            {
                return NotFound();
            }

            return Ok(plantType);
        }
    }

}