using Sprouty.Application.DTOs.Auth;
using System;
using System.Collections.Generic;
using System.Text;

namespace Sprouty.Application.Interfaces
{
    public interface IAuthService
    {
        Task<AuthResponse> RegisterAsync(RegisterRequest request);

        Task<AuthResponse> LoginAsync(LoginRequest request);
    }
}

