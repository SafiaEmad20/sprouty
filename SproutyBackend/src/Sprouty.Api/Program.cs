
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.Win32;
using Sprouty.Api.Middleware;
using Sprouty.Api.OpenApi;
using Sprouty.Application.Interfaces;
using Sprouty.Application.Services;
using Sprouty.Domain.Entities;
using Sprouty.Infrastructure;
using Sprouty.Infrastructure.Persistence;
using System.Text;
namespace Sprouty.Api
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            // Add services to the container.

            builder.Services.AddControllers();
            // Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
            builder.Services.AddOpenApi(options =>
            {
                options.AddDocumentTransformer<BearerSecuritySchemeTransformer>();
            });

            builder.Services.AddTransient<BearerSecuritySchemeTransformer>();

            // Register DbContext
            builder.Services.AddDbContext<AppDbContext>(options => options.UseSqlServer(
                                                     builder.Configuration.GetConnectionString("DefaultConnection")));


            // Register Application and Infrastructure services
            builder.Services.AddInfrastructure();
            builder.Services.AddScoped<IAuthService, AuthService>();


            // Register Plant Type service for Dependency Injection.
            builder.Services.AddScoped<IPlantTypeService, PlantTypeService>();


            // Register Sensor Processing service.
            builder.Services.AddScoped<ISensorProcessingService,SensorProcessingService>();



            // Configure JWT authentication and token validation.
            builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
        .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidIssuer = builder.Configuration["Jwt:Issuer"],

            ValidateAudience = true,
            ValidAudience = builder.Configuration["Jwt:Audience"],

            ValidateLifetime = true,

            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(
                    builder.Configuration["Jwt:Key"]!))
        };
        
    });

            var app = builder.Build();

            // Handle application exceptions globally
            app.UseMiddleware<ExceptionHandlingMiddleware>();

            // Configure the HTTP request pipeline.
            if (app.Environment.IsDevelopment())
            {
                app.MapOpenApi();
                app.UseSwaggerUI(options =>
                {
                    options.SwaggerEndpoint(
                        "/openapi/v1.json",
                        "Sprouty API v1");
                });
            }

            app.UseHttpsRedirection();

            app.UseAuthentication();
            app.UseAuthorization();


            app.MapControllers();

            app.Run();
        }
    }
}
