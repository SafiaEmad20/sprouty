using System.Security.Cryptography;
using System.Text;
using Sprouty.Application.DTOs.Auth;
using Sprouty.Application.Exceptions;
using Sprouty.Application.Interfaces;
using Sprouty.Domain.Entities;
using Sprouty.Domain.Enums;

namespace Sprouty.Application.Services
{
    public class AuthService : IAuthService
    {
        private readonly IUserRepository _userRepository;
        private readonly IPasswordHasherService _passwordHasher;
        private readonly IJwtTokenService _jwtTokenService;
        private readonly IEmailService _emailService;
        private readonly IAppLinkBuilder _linkBuilder;

        public AuthService(
            IUserRepository userRepository,
            IPasswordHasherService passwordHasher,
            IJwtTokenService jwtTokenService,
            IEmailService emailService,
            IAppLinkBuilder linkBuilder)
        {
            _userRepository = userRepository;
            _passwordHasher = passwordHasher;
            _jwtTokenService = jwtTokenService;
            _emailService = emailService;
            _linkBuilder = linkBuilder;
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

        //  منطق Forgot Password: توليد التوكن وإرسال الإيميل
        public async Task ForgotPasswordAsync(
            ForgotPasswordRequest request,
            CancellationToken cancellationToken = default)

        {
            string email = request.Email.Trim().ToLowerInvariant();
            var user = await _userRepository.GetByEmailAsync(email, cancellationToken);

           
            if (user is null) return;
           
            // توليد Secure Random Token 
            string rawToken = Convert.ToHexString(RandomNumberGenerator.GetBytes(32));

            // تشفير التوكن 
            string tokenHash = HashToken(rawToken);

            var resetToken = new PasswordResetToken
            {
                Id = Guid.NewGuid(),
                UserId = user.Id,
                TokenHash = tokenHash,
                ExpiresAt = DateTime.UtcNow.AddMinutes(15),
                CreatedAt = DateTime.UtcNow
            };

            // أي لينك قديم لسه ماتستخدمش بيتلغي، فآخر إيميل بس هو اللي يشتغل.
            await _userRepository.InvalidateResetTokensAsync(user.Id, cancellationToken);
            await _userRepository.AddResetTokenAsync(resetToken, cancellationToken);
            await _userRepository.SaveChangesAsync(cancellationToken);

            // رابط إعادة التعيين
            // اللينك بيفتح صفحة Reset Password في الفرونت (Frontend:BaseUrl)، مش الـAPI.
            string resetLink = _linkBuilder.PasswordResetLink(rawToken, user.Email);

            try
            {
                await _emailService.SendPasswordResetEmailAsync(user.Email, resetLink, cancellationToken);
            }
            catch (Exception)
            {
                // لو الإيميل فشل يتبعت، الرد بيفضل نفس الـ200 اللي بيرجع لأي إيميل،
                // عشان محدش يعرف من الـ500 إن الإيميل متسجل. سبب الفشل بيتكتب في الـconsole
                // من EmailService ("[SMTP Error]").
            }
        }

        //  منطق Reset Password
        public async Task ResetPasswordAsync(
            ResetPasswordRequest request,
            CancellationToken cancellationToken = default)
        {
            string email = request.Email.Trim().ToLowerInvariant();
            string tokenHash = HashToken(request.Token);

            var resetToken = await _userRepository.GetResetTokenByHashAsync(tokenHash, cancellationToken);

            if (resetToken is null ||
                resetToken.User.Email != email ||
                resetToken.UsedAt != null ||
                resetToken.ExpiresAt < DateTime.UtcNow)
            {
                throw new ValidationException("Invalid or expired password reset token.");
            }

            // تشفير وتحديث كلمة المرور الجديدة
            resetToken.User.PasswordHash = _passwordHasher.HashPassword(request.NewPassword);

            // تعليم التوكن بأنه تم استخدامه
            resetToken.UsedAt = DateTime.UtcNow;

            await _userRepository.SaveChangesAsync(cancellationToken);
        }

        private static string HashToken(string token)
        {
            byte[] bytes = SHA256.HashData(Encoding.UTF8.GetBytes(token));
            return Convert.ToHexString(bytes);
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