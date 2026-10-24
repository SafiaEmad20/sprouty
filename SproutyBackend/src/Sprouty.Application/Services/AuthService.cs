
using Sprouty.Application.DTOs.Auth;
using Sprouty.Application.Interfaces;
using Sprouty.Domain.Entities;
using Sprouty.Domain.Enums;
using Sprouty.Application.Exceptions;

namespace Sprouty.Application.Services
{

    public class AuthService : IAuthService
    {
        private readonly IUserRepository _userRepository;
        private readonly IPasswordHasherService _passwordHasher;
        private readonly IJwtTokenService _jwtTokenService;

        public AuthService(
            IUserRepository userRepository,
            IPasswordHasherService passwordHasher,
            IJwtTokenService jwtTokenService)
        {
            _userRepository = userRepository;
            _passwordHasher = passwordHasher;
            _jwtTokenService = jwtTokenService;
        }

        public async Task<AuthResponse> RegisterAsync(
            RegisterRequest request)
        {
            string email = request.Email.Trim().ToLowerInvariant();

            bool emailExists =
                await _userRepository.EmailExistsAsync(email);

            if (emailExists)
            {
                throw new ConflictException(
                             "An account with this email already exists.");
            }

            var user = new User
            {
                Id = Guid.NewGuid(),
                Name = request.Name.Trim(),
                Email = email,
                PasswordHash = _passwordHasher.HashPassword(
                    request.Password),
                Role = UserRole.User,
                CreatedAt = DateTime.UtcNow
            };

            await _userRepository.AddAsync(user);
            await _userRepository.SaveChangesAsync();

            var (token, expiresAt) =
                _jwtTokenService.GenerateToken(user);

            return MapToAuthResponse(user, token, expiresAt);
        }

        public async Task<AuthResponse> LoginAsync(
            LoginRequest request)
        {
            string email = request.Email.Trim().ToLowerInvariant();

            var user = await _userRepository.GetByEmailAsync(email);

            if (user is null ||
                !_passwordHasher.VerifyPassword(
                    user.PasswordHash,
                    request.Password))
            {
                throw new UnauthorizedAccessException(
                    "Invalid email or password.");
            }

            var (token, expiresAt) =
                _jwtTokenService.GenerateToken(user);

            return MapToAuthResponse(user, token, expiresAt);
        }

        private static AuthResponse MapToAuthResponse(
            User user,
            string token,
            DateTime expiresAt)
        {
            return new AuthResponse
            {
                UserId = user.Id,
                Name = user.Name,
                Email = user.Email,
                Role = user.Role.ToString(),
                Token = token,
                ExpiresAt = expiresAt
            };
        }
    }
}