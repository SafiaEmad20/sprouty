using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Sprouty.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Text;

namespace Sprouty.Infrastructure.Persistence.Configurations
{
    public class SensorReadingConfiguration : IEntityTypeConfiguration<SensorReading>
    {
        public void Configure(EntityTypeBuilder<SensorReading> b)
        {
            b.ToTable("sensor_readings");
            b.HasKey(x => x.Id);

            b.Property(x => x.SensorId).IsRequired();
            b.Property(x => x.Moisture).IsRequired();
            b.Property(x => x.Temperature).IsRequired();
            b.Property(x => x.Humidity).IsRequired();
            b.Property(x => x.Light).IsRequired();
            b.Property(x => x.RecordedAt).IsRequired().HasDefaultValueSql("SYSUTCDATETIME()");

            b.HasOne(x => x.Sensor)
             .WithMany(s => s.Readings)
             .HasForeignKey(x => x.SensorId)
             .OnDelete(DeleteBehavior.Cascade);

            b.HasIndex(x => new { x.SensorId, x.RecordedAt });
        }
    }
}
