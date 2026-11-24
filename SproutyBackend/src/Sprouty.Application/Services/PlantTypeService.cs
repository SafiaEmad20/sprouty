
using Sprouty.Application.Common;
using Sprouty.Application.DTOs.PlantTypes;
using Sprouty.Application.Exceptions;
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

        // البحث بالاسم الإنجليزي أو العربي (أو التصنيف من 3 حروف)، والأقرب في الأول.
        public async Task<IEnumerable<PlantTypeResponseDto>> SearchAsync(
            string? query,
            CancellationToken cancellationToken = default)
        {
            if (query is not null && query.Trim().Length > TextSearch.MaxQueryLength)
            {
                throw new ValidationException($"Search text must be {TextSearch.MaxQueryLength} characters or fewer.");
            }

            var plantTypes = await _plantTypeRepository.GetAllAsync(cancellationToken);

            if (string.IsNullOrWhiteSpace(query))
            {
                return plantTypes.OrderBy(p => p.NameEn).Select(MapToResponseDto).ToList();
            }

            return plantTypes
                .Select(p => new { PlantType = p, Score = ScorePlantType(query, p) })
                .Where(x => x.Score > 0)
                .OrderByDescending(x => x.Score)
                .ThenBy(x => x.PlantType.NameEn)
                .Select(x => MapToResponseDto(x.PlantType))
                .ToList();
        }

        private static int ScorePlantType(string query, PlantType plantType)
        {
            var nameScore = TextSearch.Score(query, plantType.NameEn, plantType.NameAr);

            // A category ("أعشاب") also matches, but never ranks above a name match.
            var categoryScore = TextSearch.Normalize(query).Length >= 3
                ? Math.Min(70, TextSearch.Score(query, plantType.Category))
                : 0;

            return Math.Max(nameScore, categoryScore);
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