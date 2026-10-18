using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Sprouty.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Text;

namespace Sprouty.Infrastructure.Persistence.Configurations
{
    public class NotificationConfiguration : IEntityTypeConfiguration<Notification>
    {
        public void Configure(EntityTypeBuilder<Notification> b)
        {
            b.ToTable("notifications");
            b.HasKey(x => x.Id);

            b.Property(x => x.PlantId).IsRequired();
            b.Property(x => x.Title).IsRequired().HasMaxLength(150);
            b.Property(x => x.Message).IsRequired().HasMaxLength(500);
            b.Property(x => x.Type).IsRequired().HasConversion<string>().HasMaxLength(30);
            b.Property(x => x.IsRead).IsRequired().HasDefaultValue(false);
            b.Property(x => x.CreatedAt).IsRequired().HasDefaultValueSql("SYSUTCDATETIME()");

            b.HasOne(x => x.Plant)
             .WithMany(p => p.Notifications)
             .HasForeignKey(x => x.PlantId)
             .OnDelete(DeleteBehavior.Cascade);

            b.HasIndex(x => new { x.PlantId, x.IsRead });
        }
    }
}
