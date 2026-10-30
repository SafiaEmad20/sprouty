
using Microsoft.Extensions.DependencyInjection;
using Sprouty.Application.Interfaces;
using Sprouty.Infrastructure.Repositories;
using Sprouty.Infrastructure.Services;

namespace Sprouty.Infrastructure;

public static class DependencyInjection
{
    public static IServiceCollection AddInfrastructure(
        this IServiceCollection services)
    {
        services.AddScoped<IUserRepository, UserRepository>();
        services.AddScoped<IPlantTypeRepository, PlantTypeRepository>();
        services.AddScoped<IPasswordHasherService, PasswordHasherService>();
        services.AddScoped<IJwtTokenService, JwtTokenService>();
        services.AddScoped<ISensorProcessingRepository,SensorProcessingRepository>();

        return services;
    }
}
