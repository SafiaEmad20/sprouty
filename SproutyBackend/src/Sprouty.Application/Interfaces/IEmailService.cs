namespace Sprouty.Application.Interfaces
{

    public interface IEmailService
    {
        Task SendPasswordResetEmailAsync( string email,string resetLink, CancellationToken cancellationToken = default);
    }
}