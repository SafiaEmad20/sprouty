using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Sprouty.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Text;

namespace Sprouty.Infrastructure.Persistence.Configurations
{
    public class PlantConfiguration : IEntityTypeConfiguration<Plant>
    {
        public void Configure(EntityTypeBuilder<Plant> b)
        {
            b.ToTable("plants");
            b.HasKey(x => x.Id);

            b.Property(x => x.UserId).IsRequired();
            b.Property(x => x.PlantTypeId).IsRequired();
            b.Property(x => x.Nickname).IsRequired().HasMaxLength(100);
            b.Property(x => x.ImageUrl).HasMaxLength(500);
            b.Property(x => x.AddedAt).IsRequired().HasDefaultValueSql("SYSUTCDATETIME()");

            b.HasOne(x => x.User)
             .WithMany(u => u.Plants)
             .HasForeignKey(x => x.UserId)
             .OnDelete(DeleteBehavior.Cascade);

            b.HasOne(x => x.PlantType)
             .WithMany(t => t.Plants)
             .HasForeignKey(x => x.PlantTypeId)
             .OnDelete(DeleteBehavior.Restrict);

            b.HasIndex(x => x.UserId);
        }
    }
}
