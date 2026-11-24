using Sprouty.Domain.Entities;

namespace Sprouty.Application.Interfaces

{

    public interface IUserRepository
    {
        Task<User?> GetByEmailAsync(string email, CancellationToken cancellationToken = default);

        Task AddAsync(User user, CancellationToken cancellationToken = default);

        Task<bool> EmailExistsAsync(string email, CancellationToken cancellationToken = default);

        Task<bool> ExistsAsync(Guid userId, CancellationToken cancellationToken = default);

        Task AddResetTokenAsync(PasswordResetToken token, CancellationToken cancellationToken = default);

        Task<PasswordResetToken?> GetResetTokenByHashAsync(string tokenHash, CancellationToken cancellationToken = default);

        // Marks every unused reset token of the user as used, so only the newest link works.
        Task InvalidateResetTokensAsync(Guid userId, CancellationToken cancellationToken = default);

        Task SaveChangesAsync(CancellationToken cancellationToken = default);
    }
}