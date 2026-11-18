using MailKit;
using MailKit.Security;
using Microsoft.Extensions.Options;
using MimeKit;
using Sprouty.Application.Interfaces;
using Sprouty.Infrastructure.Settings;
using SmtpClient = MailKit.Net.Smtp.SmtpClient;

namespace Sprouty.Infrastructure.Services;

public class EmailService : IEmailService
{
    private readonly EmailSettings _emailSettings;

    public EmailService(IOptions<EmailSettings> emailSettings)
    {
        _emailSettings = emailSettings.Value;
    }

    public async Task SendPasswordResetEmailAsync(
        string email,
        string resetLink,
        CancellationToken cancellationToken = default)
    {
        try
        {
            if (string.IsNullOrWhiteSpace(_emailSettings.Password) ||
                string.IsNullOrWhiteSpace(_emailSettings.Username))
            {
                throw new InvalidOperationException(
                    "Email SMTP credentials are not configured.");
            }

            var message = new MimeMessage();

            message.From.Add(
                new MailboxAddress(
                    _emailSettings.FromName,
                    _emailSettings.FromEmail));

            message.To.Add(MailboxAddress.Parse(email));

            message.Subject = "Sprouty - Reset Your Password";

            var bodyBuilder = new BodyBuilder
            {
                HtmlBody = $"""
                    <h2>Password Reset</h2>
                    <p>We received a request to reset your password.</p>
                    <p>Click the link below to reset your password:</p>
                    <a href="{System.Net.WebUtility.HtmlEncode(resetLink)}">
                        Reset Password
                    </a>
                    """
            };

            message.Body = bodyBuilder.ToMessageBody();

            using var protocolLogger = new ProtocolLogger(Path.Combine(AppContext.BaseDirectory, "smtp.log"));
            using var client = new SmtpClient(protocolLogger);

            client.LocalDomain = "localhost";

            // اتصال آمن واكتشاف تلقائي للتشفير المناسب
            await client.ConnectAsync(
                _emailSettings.Host,
                _emailSettings.Port,
                SecureSocketOptions.StartTls,
                cancellationToken);

            await client.AuthenticateAsync(
                _emailSettings.Username,
                _emailSettings.Password,
                cancellationToken);

            await client.SendAsync(message, cancellationToken);

            await client.DisconnectAsync(true, cancellationToken);
        }
        catch (Exception ex)
        {
            Console.WriteLine($"[SMTP Error]: {ex}");
            throw;
        }
    }
}