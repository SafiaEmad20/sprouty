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
using Sprouty.Infrastructure.Settings;
using System.Text;
using Sprouty.Api.BackgroundServices;
using Sprouty.Infrastructure.Services;

using System.Text.Json.Serialization;
namespace Sprouty.Api
{
    public class Program
    {
        private const string FrontendCorsPolicy = "Frontend";

        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            // Add services to the container.

            // Enums are sent as names ("NeedsWater"), not numbers (2).
            builder.Services.AddControllers()
                .AddJsonOptions(options =>
                    options.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter()));

            // Swagger/OpenAPI reads these options, so it also shows enums as names.
            builder.Services.ConfigureHttpJsonOptions(options =>
                options.SerializerOptions.Converters.Add(new JsonStringEnumConverter()));

            // CORS: lets a deployed frontend on another address call the API.
            // In development the Angular proxy is used, so this is only needed after deployment.
            var allowedOrigins = builder.Configuration.GetSection("Cors:AllowedOrigins").Get<string[]>()
                                 ?? new[] { "http://localhost:4200" };
            builder.Services.AddCors(options =>
                options.AddPolicy(FrontendCorsPolicy, policy => policy
                    .WithOrigins(allowedOrigins)
                    .AllowAnyHeader()
                    .AllowAnyMethod()));
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

            builder.Services.AddSingleton<ISensorReadingStore, InMemorySensorReadingStore>();
            builder.Services.AddHostedService<SerialSensorReaderService>();



            builder.Services.AddScoped<IAuthService, AuthService>();


            // Register Plant Type service for Dependency Injection.
            builder.Services.AddScoped<IPlantTypeService, PlantTypeService>();


            // Register Sensor Processing service.
            builder.Services.AddScoped<ISensorProcessingService,SensorProcessingService>();


            // Register Plant service (Plant CRUD).
            builder.Services.AddScoped<IPlantService, PlantService>();


            // Register Plant Readings service (readings history, latest reading, add reading).
            builder.Services.AddScoped<IPlantReadingService, PlantReadingService>();

            // Configure Email Settings (SMTP) for Password Reset and Notifications
            builder.Services.Configure<EmailSettings>(
                builder.Configuration.GetSection("EmailSettings"));

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

            app.UseCors(FrontendCorsPolicy);

            app.UseAuthentication();

            // A valid token whose user no longer exists gets 401 (not a 500 later on).
            app.UseMiddleware<UserExistsMiddleware>();

            app.UseAuthorization();


            app.MapControllers();

            app.Run();
        }
    }
}
