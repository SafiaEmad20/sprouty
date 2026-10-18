using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Sprouty.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Text;

namespace Sprouty.Infrastructure.Persistence.Configurations
{
    public class PlantTypeConfiguration : IEntityTypeConfiguration<PlantType>
    {
        public void Configure(EntityTypeBuilder<PlantType> b)
        {
            b.ToTable("plant_types");
            b.HasKey(x => x.Id);

            b.Property(x => x.NameAr).IsRequired().HasMaxLength(100);
            b.Property(x => x.NameEn).IsRequired().HasMaxLength(100);
            b.Property(x => x.Category).IsRequired().HasMaxLength(50);
            b.Property(x => x.ImageUrl).HasMaxLength(500);   

            b.HasData(
                new PlantType { Id = Guid.Parse("a1000000-0000-0000-0000-000000000001"), NameAr = "ريحان", NameEn = "Basil", Category = "أعشاب" },
                new PlantType { Id = Guid.Parse("a1000000-0000-0000-0000-000000000002"), NameAr = "نعناع", NameEn = "Mint", Category = "أعشاب" },
                new PlantType { Id = Guid.Parse("a1000000-0000-0000-0000-000000000003"), NameAr = "زهور", NameEn = "Flowers", Category = "زهور" },
                new PlantType { Id = Guid.Parse("a1000000-0000-0000-0000-000000000004"), NameAr = "نوع عام", NameEn = "Generic", Category = "عام" });
        }
    }
}
