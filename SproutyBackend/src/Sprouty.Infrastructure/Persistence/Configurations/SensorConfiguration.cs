using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Sprouty.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Text;

namespace Sprouty.Infrastructure.Persistence.Configurations
{
    public class SensorConfiguration : IEntityTypeConfiguration<Sensor>
    {
        public void Configure(EntityTypeBuilder<Sensor> b)
        {
            b.ToTable("sensors");
            b.HasKey(x => x.Id);

            b.Property(x => x.PlantId).IsRequired();
            b.Property(x => x.DeviceCode).IsRequired().HasMaxLength(100);
            b.Property(x => x.Status).IsRequired().HasConversion<string>().HasMaxLength(20);
            b.Property(x => x.LastSeenAt);                   

            b.HasIndex(x => x.DeviceCode).IsUnique();

            b.HasOne(x => x.Plant)
             .WithMany(p => p.Sensors)
             .HasForeignKey(x => x.PlantId)
             .OnDelete(DeleteBehavior.Cascade);
        }
    }
}
