namespace Sprouty.Application.Interfaces
{
    // Builds links to pages of the frontend (for example in emails).
    public interface IAppLinkBuilder
    {
        string PasswordResetLink(string token, string email);
    }
}
