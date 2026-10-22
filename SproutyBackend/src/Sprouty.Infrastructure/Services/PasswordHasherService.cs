using Sprouty.Application.Interfaces;
using Microsoft.AspNetCore.Identity;
using Sprouty.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Text;

namespace Sprouty.Infrastructure.Services
{
    public class PasswordHasherService : IPasswordHasherService
    {
        private readonly PasswordHasher<User> _passwordHasher = new();

        public string HashPassword(string password)
        {
            var user = new User();

            return _passwordHasher.HashPassword(user, password);
        }

        public bool VerifyPassword(
            string hashedPassword,
            string providedPassword)
        {
            var user = new User();

            var result = _passwordHasher.VerifyHashedPassword(
                user,
                hashedPassword,
                providedPassword);

            return result != PasswordVerificationResult.Failed;
        }
    }
}
