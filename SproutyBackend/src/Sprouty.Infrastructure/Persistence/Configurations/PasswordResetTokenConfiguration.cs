using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Sprouty.Domain.Entities;

namespace Sprouty.Infrastructure.Persistence.Configurations;

public class PasswordResetTokenConfiguration : IEntityTypeConfiguration<PasswordResetToken>
{
    public void Configure(EntityTypeBuilder<PasswordResetToken> builder)
    {
       
        builder.ToTable("PasswordResetTokens");

        // Primary Key
        builder.HasKey(t => t.Id);

       
        builder.Property(t => t.TokenHash)
            .IsRequired()
            .HasMaxLength(128);

        builder.Property(t => t.ExpiresAt)
            .IsRequired();

        builder.Property(t => t.UsedAt)
            .IsRequired(false);

        builder.Property(t => t.CreatedAt)
            .IsRequired();

        // Unique Index لضمان عدم تكرار التوكن وتسريع البحث
        builder.HasIndex(t => t.TokenHash)
            .IsUnique()
            .HasDatabaseName("IX_PasswordResetTokens_TokenHash");

        builder.HasIndex(t => t.UserId)
            .HasDatabaseName("IX_PasswordResetTokens_UserId");

        // العلاقة مع جدول المستخدمين
        builder.HasOne(t => t.User)
            .WithMany(u => u.PasswordResetTokens)
            .HasForeignKey(t => t.UserId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}