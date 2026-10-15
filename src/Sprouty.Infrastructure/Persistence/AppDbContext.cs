using Microsoft.EntityFrameworkCore;
using Sprouty.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Text;

namespace Sprouty.Infrastructure.Persistence
{
    public class AppDbContext(DbContextOptions<AppDbContext> options) : DbContext(options)
    {
        public DbSet<User> Users => Set<User>();
        public DbSet<PlantType> PlantTypes => Set<PlantType>();
        public DbSet<PlantRequirement> PlantRequirements => Set<PlantRequirement>();
        public DbSet<Plant> Plants => Set<Plant>();
        public DbSet<Sensor> Sensors => Set<Sensor>();
        public DbSet<SensorReading> SensorReadings => Set<SensorReading>();
        public DbSet<PlantStatusRecord> PlantStatuses => Set<PlantStatusRecord>();
        public DbSet<Notification> Notifications => Set<Notification>();

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
            modelBuilder.ApplyConfigurationsFromAssembly(
                typeof(AppDbContext).Assembly);
        }
    }
}
