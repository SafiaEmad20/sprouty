
using Microsoft.EntityFrameworkCore;
using Sprouty.Application.Interfaces;
using Sprouty.Domain.Entities;
using Sprouty.Infrastructure.Persistence;

namespace Sprouty.Infrastructure.Repositories
{
    public class SensorProcessingRepository : ISensorProcessingRepository
    {
        private readonly AppDbContext _context;

        public SensorProcessingRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<Sensor?> GetSensorWithLatestReadingAsync(
            Guid sensorId)
        {
            var sensor = await _context.Sensors
                .Include(s => s.Plant)
                    .ThenInclude(p => p.PlantType)
                        .ThenInclude(pt => pt.Requirement)
                .FirstOrDefaultAsync(s => s.Id == sensorId);

            if (sensor == null)
                return null;

            var latestReading = await _context.SensorReadings
                .Where(r => r.SensorId == sensorId)
                .OrderByDescending(r => r.RecordedAt)
                .FirstOrDefaultAsync();

            if (latestReading != null)
                sensor.Readings.Add(latestReading);

            return sensor;
        }

        public async Task SavePlantStatusAsync(
            PlantStatusRecord statusRecord)
        {
            _context.PlantStatuses.Add(statusRecord);
            await _context.SaveChangesAsync();
        }


        public async Task AddSensorReadingAsync(SensorReading reading)
        {
            _context.SensorReadings.Add(reading);
            await _context.SaveChangesAsync();
        }

    }
}
