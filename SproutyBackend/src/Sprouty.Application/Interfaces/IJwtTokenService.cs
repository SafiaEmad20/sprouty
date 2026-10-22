using System;
using System.Collections.Generic;
using Sprouty.Domain.Entities;
using System.Text;

namespace Sprouty.Application.Interfaces
{
    public interface IJwtTokenService
    {
        (string Token, DateTime ExpiresAt) GenerateToken(User user);
    }

}
