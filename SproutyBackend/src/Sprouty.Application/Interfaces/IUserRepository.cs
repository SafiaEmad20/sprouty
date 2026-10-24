using Sprouty.Domain.Entities;
namespace Sprouty.Application.Interfaces
{
    public interface IUserRepository
    {
        Task<User?> GetByEmailAsync(string email);

        Task AddAsync(User user);

        Task<bool> EmailExistsAsync(string email);

        Task SaveChangesAsync();
    }
}
