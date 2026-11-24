using Microsoft.EntityFrameworkCore;
using Sprouty.Domain.Entities;
using Sprouty.Infrastructure.Persistence.Converters;
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
        public DbSet<PasswordResetToken> PasswordResetTokens => Set<PasswordResetToken>();

        // Every DateTime / DateTime? column is read back as UTC, so the API always sends "...Z".
        protected override void ConfigureConventions(ModelConfigurationBuilder configurationBuilder)
        {
            configurationBuilder.Properties<DateTime>().HaveConversion<UtcDateTimeConverter>();
            configurationBuilder.Properties<DateTime?>().HaveConversion<UtcDateTimeConverter>();
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
            modelBuilder.ApplyConfigurationsFromAssembly(
                typeof(AppDbContext).Assembly);
        }
    }
}
