using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Sprouty.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Text;

namespace Sprouty.Infrastructure.Persistence.Configurations
{
    
    public class PlantRequirementConfiguration : IEntityTypeConfiguration<PlantRequirement>
    {
        public void Configure(EntityTypeBuilder<PlantRequirement> b)
        {
            b.ToTable("plant_requirements");
            b.HasKey(x => x.Id);

            b.Property(x => x.PlantTypeId).IsRequired();
            b.Property(x => x.MinMoisture).IsRequired();
            b.Property(x => x.MaxMoisture).IsRequired();
            b.Property(x => x.MinTemperature).IsRequired();
            b.Property(x => x.MaxTemperature).IsRequired();
            b.Property(x => x.MinHumidity).IsRequired();
            b.Property(x => x.MaxHumidity).IsRequired();
            b.Property(x => x.MinLight).IsRequired();
            b.Property(x => x.MaxLight).IsRequired();

            b.HasOne(x => x.PlantType)
             .WithOne(t => t.Requirement)
             .HasForeignKey<PlantRequirement>(x => x.PlantTypeId)
             .OnDelete(DeleteBehavior.Cascade);

            b.HasIndex(x => x.PlantTypeId).IsUnique();

            // TEMPORARY light ranges (relative 0-100 scale). Need real calibration.
            b.HasData(
                new PlantRequirement
                {
                    Id = Guid.Parse("b1000000-0000-0000-0000-000000000001"),
                    PlantTypeId = Guid.Parse("a1000000-0000-0000-0000-000000000001"),
                    MinMoisture = 40,
                    MaxMoisture = 70,
                    MinTemperature = 18,
                    MaxTemperature = 30,
                    MinHumidity = 40,
                    MaxHumidity = 70,
                    MinLight = 40,
                    MaxLight = 90
                },
                new PlantRequirement
                {
                    Id = Guid.Parse("b1000000-0000-0000-0000-000000000002"),
                    PlantTypeId = Guid.Parse("a1000000-0000-0000-0000-000000000002"),
                    MinMoisture = 50,
                    MaxMoisture = 80,
                    MinTemperature = 15,
                    MaxTemperature = 27,
                    MinHumidity = 40,
                    MaxHumidity = 70,
                    MinLight = 30,
                    MaxLight = 80
                },
                new PlantRequirement
                {
                    Id = Guid.Parse("b1000000-0000-0000-0000-000000000003"),
                    PlantTypeId = Guid.Parse("a1000000-0000-0000-0000-000000000003"),
                    MinMoisture = 40,
                    MaxMoisture = 70,
                    MinTemperature = 15,
                    MaxTemperature = 28,
                    MinHumidity = 40,
                    MaxHumidity = 60,
                    MinLight = 50,
                    MaxLight = 100
                },
                new PlantRequirement
                {
                    Id = Guid.Parse("b1000000-0000-0000-0000-000000000004"),
                    PlantTypeId = Guid.Parse("a1000000-0000-0000-0000-000000000004"),
                    MinMoisture = 30,
                    MaxMoisture = 70,
                    MinTemperature = 15,
                    MaxTemperature = 30,
                    MinHumidity = 30,
                    MaxHumidity = 70,
                    MinLight = 20,
                    MaxLight = 80
                });
        }
    }
}
