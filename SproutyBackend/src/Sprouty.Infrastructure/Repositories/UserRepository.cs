using Microsoft.EntityFrameworkCore;
using Sprouty.Application.Interfaces;
using Sprouty.Domain.Entities;
using Sprouty.Infrastructure.Persistence;

namespace Sprouty.Infrastructure.Repositories
{

    public class UserRepository : IUserRepository
    {
        private readonly AppDbContext _context;

        public UserRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<User?> GetByEmailAsync(string email, CancellationToken cancellationToken = default)
        {
            string normalizedEmail = email.Trim().ToLowerInvariant();

            return await _context.Users
                .FirstOrDefaultAsync(u => u.Email == normalizedEmail, cancellationToken);
        }

        public async Task<bool> EmailExistsAsync(string email, CancellationToken cancellationToken = default)
        {
            string normalizedEmail = email.Trim().ToLowerInvariant();

            return await _context.Users
                .AnyAsync(u => u.Email == normalizedEmail, cancellationToken);
        }

        public async Task<bool> ExistsAsync(Guid userId, CancellationToken cancellationToken = default)
        {
            return await _context.Users.AnyAsync(u => u.Id == userId, cancellationToken);
        }

        public async Task AddAsync(User user, CancellationToken cancellationToken = default)
        {
            await _context.Users.AddAsync(user, cancellationToken);
        }

        public async Task AddResetTokenAsync(PasswordResetToken token, CancellationToken cancellationToken = default)
        {
            await _context.PasswordResetTokens.AddAsync(token, cancellationToken);
        }

        public async Task<PasswordResetToken?> GetResetTokenByHashAsync(string tokenHash, CancellationToken cancellationToken = default)
        {
            return await _context.PasswordResetTokens
                .Include(t => t.User) // ضروري جداً لجلب المستخدم مع التوكن
                .FirstOrDefaultAsync(t => t.TokenHash == tokenHash, cancellationToken);
        }

        public async Task InvalidateResetTokensAsync(Guid userId, CancellationToken cancellationToken = default)
        {
            var unusedTokens = await _context.PasswordResetTokens
                .Where(t => t.UserId == userId && t.UsedAt == null)
                .ToListAsync(cancellationToken);

            var now = DateTime.UtcNow;
            foreach (var token in unusedTokens)
            {
                token.UsedAt = now;
            }
        }

        public async Task SaveChangesAsync(CancellationToken cancellationToken = default)
        {
            await _context.SaveChangesAsync(cancellationToken);
        }
    }
}