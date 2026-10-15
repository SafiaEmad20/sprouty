using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Sprouty.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Text;

namespace Sprouty.Infrastructure.Persistence.Configurations
{
    public class PlantStatusRecordConfiguration : IEntityTypeConfiguration<PlantStatusRecord>
    {
        public void Configure(EntityTypeBuilder<PlantStatusRecord> b)
        {
            b.ToTable("plant_statuses");
            b.HasKey(x => x.Id);

            b.Property(x => x.PlantId).IsRequired();
            b.Property(x => x.StatusType).IsRequired().HasConversion<string>().HasMaxLength(30);
            b.Property(x => x.Message).IsRequired().HasMaxLength(300);
            b.Property(x => x.ComputedAt).IsRequired().HasDefaultValueSql("SYSUTCDATETIME()");

            b.HasOne(x => x.Plant)
             .WithMany(p => p.StatusHistory)
             .HasForeignKey(x => x.PlantId)
             .OnDelete(DeleteBehavior.Cascade);

            b.HasIndex(x => new { x.PlantId, x.ComputedAt });
        }
    }
}
