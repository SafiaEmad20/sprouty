using Sprouty.Application.DTOs.PlantTypes;
using Sprouty.Application.DTOs.Readings;
using Sprouty.Application.DTOs.Sensors;
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
    public class PlantReadingService : IPlantReadingService
    {
        public const int DefaultLimit = 100;
        public const int MaxLimit = 1000;

        private readonly IPlantRepository _plantRepository;
        private readonly IPlantTypeRepository _plantTypeRepository;
        private readonly IPlantReadingRepository _readingRepository;
        private readonly ISensorProcessingService _sensorProcessingService;

        public PlantReadingService(
            IPlantRepository plantRepository,
            IPlantTypeRepository plantTypeRepository,
            IPlantReadingRepository readingRepository,
            ISensorProcessingService sensorProcessingService)
        {
            _plantRepository = plantRepository;
            _plantTypeRepository = plantTypeRepository;
            _readingRepository = readingRepository;
            _sensorProcessingService = sensorProcessingService;
        }

        // تاريخ قراءات النبتة (من الأقدم للأحدث) عشان الرسم البياني
        public async Task<IEnumerable<SensorReadingResponseDto>> GetReadingsAsync(
            Guid plantId,
            Guid userId,
            int limit,
            CancellationToken cancellationToken = default)
        {
            if (limit < 1 || limit > MaxLimit)
            {
                throw new ValidationException($"Limit must be between 1 and {MaxLimit}.");
            }

            await GetUserPlantOrThrowAsync(plantId, userId, cancellationToken);

            var readings = await _readingRepository.GetLatestReadingsAsync(plantId, limit, cancellationToken);

            return readings.Select(MapReading);
        }

        // آخر قراءة + المدى المثالي لنوع النبتة + آخر حالة اتحسبت
        public async Task<PlantLatestReadingResponseDto> GetLatestAsync(
            Guid plantId,
            Guid userId,
            CancellationToken cancellationToken = default)
        {
            var plant = await GetUserPlantOrThrowAsync(plantId, userId, cancellationToken);

            var reading = await _readingRepository.GetLatestReadingAsync(plantId, cancellationToken);
            var status = await _readingRepository.GetLatestStatusAsync(plantId, cancellationToken);
            var plantType = await _plantTypeRepository.GetByIdAsync(plant.PlantTypeId, cancellationToken);

            return new PlantLatestReadingResponseDto
            {
                PlantId = plantId,
                Reading = reading is null ? null : MapReading(reading),
                Requirement = MapRequirement(plantType?.Requirement),
                Status = status is null ? null : new PlantStatusResponseDto
                {
                    PlantId = status.PlantId,
                    Status = status.StatusType,
                    Message = status.Message,
                    ComputedAt = status.ComputedAt
                }
            };
        }

        // إضافة قراءة للنبتة: بتتسجل على الـSensor بتاعها، وبعدين الحالة بتتحسب
        // (ولو النبتة محتاجة اهتمام بيتعمل إشعار).
        public async Task<AddPlantReadingResponseDto> AddReadingAsync(
            Guid plantId,
            Guid userId,
            AddSensorReadingRequestDto request,
            CancellationToken cancellationToken = default)
        {
            var plant = await GetUserPlantOrThrowAsync(plantId, userId, cancellationToken);

            // القراءة بتتسجل على الـSensor الـActive بتاع النبتة بس
            var sensor = plant.Sensors.FirstOrDefault(s => s.Status == SensorStatus.Active);

            if (sensor is null)
            {
                if (plant.Sensors.Count > 0)
                {
                    throw new SensorOfflineException("The plant's sensor is offline.");
                }

                throw new NotFoundException("No sensor is linked to this plant.");
            }

            var reading = await _sensorProcessingService.AddReadingAsync(sensor.Id, request);
            var status = await _sensorProcessingService.ProcessReadingAsync(sensor.Id);

            return new AddPlantReadingResponseDto
            {
                Reading = reading,
                Status = status
            };
        }

        private async Task<Plant> GetUserPlantOrThrowAsync(
            Guid plantId,
            Guid userId,
            CancellationToken cancellationToken)
        {
            var plant = await _plantRepository.GetByIdForUserAsync(plantId, userId, cancellationToken);

            if (plant is null)
            {
                throw new NotFoundException("Plant not found.");
            }

            return plant;
        }

        private static SensorReadingResponseDto MapReading(SensorReading reading)
        {
            return new SensorReadingResponseDto
            {
                Id = reading.Id,
                SensorId = reading.SensorId,
                Moisture = reading.Moisture,
                Temperature = reading.Temperature,
                Humidity = reading.Humidity,
                Light = reading.Light,
                RecordedAt = reading.RecordedAt
            };
        }

        private static PlantRequirementResponseDto? MapRequirement(PlantRequirement? requirement)
        {
            if (requirement is null)
            {
                return null;
            }

            return new PlantRequirementResponseDto
            {
                MinMoisture = requirement.MinMoisture,
                MaxMoisture = requirement.MaxMoisture,
                MinTemperature = requirement.MinTemperature,
                MaxTemperature = requirement.MaxTemperature,
                MinHumidity = requirement.MinHumidity,
                MaxHumidity = requirement.MaxHumidity,
                MinLight = requirement.MinLight,
                MaxLight = requirement.MaxLight
            };
        }
    }
}
