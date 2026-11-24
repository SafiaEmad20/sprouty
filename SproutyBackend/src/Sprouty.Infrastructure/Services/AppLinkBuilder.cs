using Microsoft.Extensions.Configuration;
using Sprouty.Application.Interfaces;

namespace Sprouty.Infrastructure.Services;

// The frontend address comes from appsettings.json → "Frontend:BaseUrl".
public class AppLinkBuilder : IAppLinkBuilder
{
    private const string DefaultBaseUrl = "http://localhost:4200";

    private readonly string _baseUrl;

    public AppLinkBuilder(IConfiguration configuration)
    {
        var configured = configuration["Frontend:BaseUrl"];

        _baseUrl = (string.IsNullOrWhiteSpace(configured) ? DefaultBaseUrl : configured).TrimEnd('/');
    }

    public string PasswordResetLink(string token, string email) =>
        $"{_baseUrl}/reset-password?token={Uri.EscapeDataString(token)}&email={Uri.EscapeDataString(email)}";
}
