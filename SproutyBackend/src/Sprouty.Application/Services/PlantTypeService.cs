
using Sprouty.Application.DTOs.PlantTypes;
using Sprouty.Application.Interfaces;
using Sprouty.Domain.Entities;

namespace Sprouty.Application.Services
{
    public class PlantTypeService : IPlantTypeService
    {
        private readonly IPlantTypeRepository _plantTypeRepository;

        public PlantTypeService(IPlantTypeRepository plantTypeRepository)
        {
            _plantTypeRepository = plantTypeRepository;
        }

        public async Task<IEnumerable<PlantTypeResponseDto>> GetAllAsync(CancellationToken cancellationToken = default)
        {
            var plantTypes = await _plantTypeRepository.GetAllAsync(cancellationToken);

            return plantTypes.Select(MapToResponseDto);
        }

        public async Task<PlantTypeResponseDto?> GetByIdAsync( Guid id, CancellationToken cancellationToken = default)
        {
            var plantType = await _plantTypeRepository.GetByIdAsync(id, cancellationToken);

            return plantType is null
                ? null
                : MapToResponseDto(plantType);
        }

        private static PlantTypeResponseDto MapToResponseDto(
            PlantType plantType)
        {
            return new PlantTypeResponseDto
            {
                Id = plantType.Id,
                NameAr = plantType.NameAr,
                NameEn = plantType.NameEn,
                Category = plantType.Category,
                ImageUrl = plantType.ImageUrl,

                Requirement = plantType.Requirement is null
                    ? null
                    : new PlantRequirementResponseDto
                    {
                        MinMoisture = plantType.Requirement.MinMoisture,
                        MaxMoisture = plantType.Requirement.MaxMoisture,
                        MinTemperature = plantType.Requirement.MinTemperature,
                        MaxTemperature = plantType.Requirement.MaxTemperature,
                        MinHumidity = plantType.Requirement.MinHumidity,
                        MaxHumidity = plantType.Requirement.MaxHumidity,
                        MinLight = plantType.Requirement.MinLight,
                        MaxLight = plantType.Requirement.MaxLight
                    }
            };
        }
    }

}