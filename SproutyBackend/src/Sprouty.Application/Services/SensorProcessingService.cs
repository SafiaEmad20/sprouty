
using Sprouty.Application.DTOs.Sensors;
using Sprouty.Application.Interfaces;
using Sprouty.Domain.Entities;
using Sprouty.Domain.Enums;
using Sprouty.Application.Exceptions;
using System;
using System.Linq;
using System.Threading.Tasks;

namespace Sprouty.Application.Services
{
    public class SensorProcessingService : ISensorProcessingService
    {
        private readonly ISensorProcessingRepository _repository;

        public SensorProcessingService(
            ISensorProcessingRepository repository)
        {
            _repository = repository;
        }


        public async Task AddReadingAsync(Guid sensorId,AddSensorReadingRequestDto request)
        {
            var sensor = await _repository.GetSensorWithLatestReadingAsync(sensorId);

            if (sensor == null)
                throw new NotFoundException("Sensor not found.");

            if (sensor.Status == SensorStatus.Offline)
                throw new SensorOfflineException("Sensor is offline.");

            if (!double.IsFinite(request.Moisture) ||
                !double.IsFinite(request.Temperature) ||
                !double.IsFinite(request.Humidity) ||
                !double.IsFinite(request.Light))
            {
                throw new ValidationException("Sensor readings must contain valid finite numbers.");
            }

            if (request.Moisture < 0 || request.Moisture > 100)
                throw new ValidationException("Moisture must be between 0 and 100.");

            if (request.Humidity < 0 || request.Humidity > 100)
                throw new ValidationException("Humidity must be between 0 and 100.");

            if (request.Temperature < -40 || request.Temperature > 85)
                throw new ValidationException("Temperature must be between -40 and 85.");

            if (request.Light < 0 || request.Light > 4095)
                throw new ValidationException("Light must be between 0 and 4095.");

            var reading = new SensorReading
            {
                Id = Guid.NewGuid(),
                SensorId = sensorId,
                Moisture = request.Moisture,
                Temperature = request.Temperature,
                Humidity = request.Humidity,
                Light = request.Light,
                RecordedAt = DateTime.UtcNow
            };

            await _repository.AddSensorReadingAsync(reading);
        }


        public async Task<PlantStatusResponseDto> ProcessReadingAsync(Guid sensorId)
        {
            var sensor = await _repository.GetSensorWithLatestReadingAsync(sensorId);

            if (sensor == null)
                throw new NotFoundException("Sensor not found.");

            if (sensor.Status == SensorStatus.Offline)
            {
                throw new SensorOfflineException("Sensor is offline.");
            }

            var reading = sensor.Readings.OrderByDescending(r => r.RecordedAt).FirstOrDefault();

            PlantStatus status;
            string message;

            if (reading == null)
            {
                status = PlantStatus.NoData;
                message = "No sensor readings are available.";
            }
            else
            {
                var requirement = sensor.Plant?.PlantType?.Requirement;

                if (requirement == null)
                {
                    throw new NotFoundException("Plant type requirements were not found.");
                }

                // Convert the raw LDR reading to relative light percentage.
                var lightLevel = ToLightLevel(reading.Light);

                if (reading.Moisture < requirement.MinMoisture)
                {
                    status = PlantStatus.NeedsWater;
                    message = "Your plant needs water.";
                }
                else if (reading.Moisture > requirement.MaxMoisture)
                {
                    status = PlantStatus.OverWatered;
                    message = "Your plant has too much moisture.";
                }
                else if (reading.Temperature < requirement.MinTemperature)
                {
                    status = PlantStatus.TooCold;
                    message = "The temperature is too low.";
                }
                else if (reading.Temperature > requirement.MaxTemperature)
                {
                    status = PlantStatus.TooHot;
                    message = "The temperature is too high.";
                }
                else if (reading.Humidity < requirement.MinHumidity)
                {
                    status = PlantStatus.AirTooDry;
                    message = "The air humidity is too low.";
                }
                else if (reading.Humidity > requirement.MaxHumidity)
                {
                    status = PlantStatus.AirTooHumid;
                    message = "The air humidity is too high.";
                }
                else if (lightLevel < requirement.MinLight)
                {
                    status = PlantStatus.NeedsLight;
                    message = "Your plant needs more light.";
                }
                else
                {
                    status = PlantStatus.Healthy;
                    message = "All checked sensor values are within the required ranges.";
                }
            }

            var statusRecord = new PlantStatusRecord
            {
                Id = Guid.NewGuid(),
                PlantId = sensor.PlantId,
                StatusType = status,
                Message = message,
                ComputedAt = DateTime.UtcNow
            };

            await _repository.SavePlantStatusAsync(statusRecord);

            return new PlantStatusResponseDto
            {
                PlantId = statusRecord.PlantId,
                Status = statusRecord.StatusType,
                Message = statusRecord.Message,
                ComputedAt = statusRecord.ComputedAt
            };
        }

        private static double ToLightLevel(double rawLight)
        {
            var level = (4095.0 - rawLight) / 4095.0 * 100.0;

            return Math.Clamp(level, 0.0, 100.0);
        }
    }
}
