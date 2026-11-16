using Sprouty.Application.DTOs.Plants;
using Sprouty.Application.Exceptions;
using Sprouty.Application.Interfaces;
using Sprouty.Domain.Entities;
using Sprouty.Domain.Enums;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace Sprouty.Application.Services
{
    public class PlantService : IPlantService
    {
        private readonly IPlantRepository _plantRepository;
        private readonly IPlantTypeRepository _plantTypeRepository;

        public PlantService(
            IPlantRepository plantRepository,
            IPlantTypeRepository plantTypeRepository)
        {
            _plantRepository = plantRepository;
            _plantTypeRepository = plantTypeRepository;
        }

        // عرض نباتات المستخدم الحالي
        public async Task<IEnumerable<PlantResponseDto>> GetUserPlantsAsync(
            Guid userId,
            CancellationToken cancellationToken = default)
        {
            var plants = await _plantRepository.GetByUserIdAsync(userId, cancellationToken);

            return plants.Select(MapToResponseDto);
        }

        // عرض نبتة واحدة (لازم تكون تبع المستخدم)
        public async Task<PlantResponseDto> GetByIdAsync(
            Guid id,
            Guid userId,
            CancellationToken cancellationToken = default)
        {
            var plant = await GetUserPlantOrThrowAsync(id, userId, cancellationToken);

            return MapToResponseDto(plant);
        }

        // إضافة نبتة جديدة ومعاها Sensor خاص بيها
        public async Task<PlantResponseDto> CreateAsync(
            Guid userId,
            CreatePlantRequestDto request,
            CancellationToken cancellationToken = default)
        {
            var nickname = ValidateNickname(request.Nickname);
            await EnsurePlantTypeExistsAsync(request.PlantTypeId, cancellationToken);

            var plant = new Plant
            {
                Id = Guid.NewGuid(),
                UserId = userId,
                PlantTypeId = request.PlantTypeId,
                Nickname = nickname,
                ImageUrl = NormalizeImageUrl(request.ImageUrl),
                AddedAt = DateTime.UtcNow
            };

            plant.Sensors.Add(new Sensor
            {
                Id = Guid.NewGuid(),
                PlantId = plant.Id,
                DeviceCode = $"SPR-{Guid.NewGuid():N}",
                Status = SensorStatus.Active
            });

            await _plantRepository.AddAsync(plant, cancellationToken);
            await _plantRepository.SaveChangesAsync(cancellationToken);

            // Reload so the response includes the plant type names.
            var created = await GetUserPlantOrThrowAsync(plant.Id, userId, cancellationToken);

            return MapToResponseDto(created);
        }

        // تعديل بيانات نبتة
        public async Task<PlantResponseDto> UpdateAsync(
            Guid id,
            Guid userId,
            UpdatePlantRequestDto request,
            CancellationToken cancellationToken = default)
        {
            var plant = await GetUserPlantOrThrowAsync(id, userId, cancellationToken);

            var nickname = ValidateNickname(request.Nickname);

            if (plant.PlantTypeId != request.PlantTypeId)
            {
                await EnsurePlantTypeExistsAsync(request.PlantTypeId, cancellationToken);
                plant.PlantTypeId = request.PlantTypeId;

                // النوع اتغير: القراءات والحالات والإشعارات القديمة اتحسبت على النوع القديم،
                // فبنمسحها والنبتة تبدأ من جديد بالبيانات اللي هتتضاف بعد كده.
                // (الـSensor نفسه بيفضل زي ما هو)
                await _plantRepository.RemoveHistoryAsync(plant.Id, cancellationToken);
            }

            plant.Nickname = nickname;
            plant.ImageUrl = NormalizeImageUrl(request.ImageUrl);

            await _plantRepository.SaveChangesAsync(cancellationToken);

            var updated = await GetUserPlantOrThrowAsync(id, userId, cancellationToken);

            return MapToResponseDto(updated);
        }

        // حذف نبتة (الـSensors والقراءات والإشعارات بتتمسح معاها Cascade)
        public async Task DeleteAsync(
            Guid id,
            Guid userId,
            CancellationToken cancellationToken = default)
        {
            var plant = await GetUserPlantOrThrowAsync(id, userId, cancellationToken);

            _plantRepository.Remove(plant);
            await _plantRepository.SaveChangesAsync(cancellationToken);
        }

        private async Task<Plant> GetUserPlantOrThrowAsync(
            Guid id,
            Guid userId,
            CancellationToken cancellationToken)
        {
            var plant = await _plantRepository.GetByIdForUserAsync(id, userId, cancellationToken);

            if (plant is null)
            {
                throw new NotFoundException("Plant not found.");
            }

            return plant;
        }

        private async Task EnsurePlantTypeExistsAsync(
            Guid plantTypeId,
            CancellationToken cancellationToken)
        {
            if (plantTypeId == Guid.Empty)
            {
                throw new ValidationException("Plant type is required.");
            }

            var plantType = await _plantTypeRepository.GetByIdAsync(plantTypeId, cancellationToken);

            if (plantType is null)
            {
                throw new ValidationException("Plant type does not exist.");
            }
        }

        private static string ValidateNickname(string? nickname)
        {
            var trimmed = nickname?.Trim() ?? string.Empty;

            if (trimmed.Length == 0)
            {
                throw new ValidationException("Nickname is required.");
            }

            if (trimmed.Length > 100)
            {
                throw new ValidationException("Nickname must be 100 characters or fewer.");
            }

            return trimmed;
        }

        // الصورة اختيارية: لو فاضية بتتسجل null، ولو مبعوتة لازم تكون لينك http أو https صحيح.
        private static string? NormalizeImageUrl(string? imageUrl)
        {
            if (string.IsNullOrWhiteSpace(imageUrl))
            {
                return null;
            }

            var trimmed = imageUrl.Trim();

            if (trimmed.Length > 500)
            {
                throw new ValidationException("Image URL must be 500 characters or fewer.");
            }

            var isValidUrl = Uri.TryCreate(trimmed, UriKind.Absolute, out var uri)
                             && (uri.Scheme == Uri.UriSchemeHttp || uri.Scheme == Uri.UriSchemeHttps);

            if (!isValidUrl)
            {
                throw new ValidationException("Image URL must be a valid link that starts with http:// or https://.");
            }

            return trimmed;
        }

        private static PlantResponseDto MapToResponseDto(Plant plant)
        {
            return new PlantResponseDto
            {
                Id = plant.Id,
                UserId = plant.UserId,
                PlantTypeId = plant.PlantTypeId,
                PlantTypeNameAr = plant.PlantType?.NameAr ?? string.Empty,
                PlantTypeNameEn = plant.PlantType?.NameEn ?? string.Empty,
                Nickname = plant.Nickname,
                ImageUrl = plant.ImageUrl,
                AddedAt = plant.AddedAt,
                SensorId = (plant.Sensors.FirstOrDefault(s => s.Status == SensorStatus.Active)
                            ?? plant.Sensors.FirstOrDefault())?.Id
            };
        }
    }
}
