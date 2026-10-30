using Microsoft.AspNetCore.Mvc;
using Sprouty.Application.Exceptions;

namespace Sprouty.Api.Middleware
{
    public class ExceptionHandlingMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly ILogger<ExceptionHandlingMiddleware> _logger;

        public ExceptionHandlingMiddleware(
            RequestDelegate next,
            ILogger<ExceptionHandlingMiddleware> logger)
        {
            _next = next;
            _logger = logger;
        }

        public async Task InvokeAsync(HttpContext context)
        {
            try
            {
                await _next(context);
            }
            catch (ConflictException ex)
            {
                await WriteResponse(
                    context,
                    StatusCodes.Status409Conflict,
                    ex.Message);
            }


            catch (SensorOfflineException ex)
            {
                await WriteResponse(
                    context,
                    StatusCodes.Status409Conflict,
                    ex.Message);
            }


            catch (NotFoundException ex)
            {
                await WriteResponse(
                    context,
                    StatusCodes.Status404NotFound,
                    ex.Message);
            }

            catch (ValidationException ex)
            {
                await WriteResponse(
                    context,
                    StatusCodes.Status400BadRequest,
                    ex.Message);
            }


            catch (UnauthorizedAccessException)
            {
                await WriteResponse(
                    context,
                    StatusCodes.Status401Unauthorized,
                    "Invalid email or password.");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An unexpected error occurred.");

                await WriteResponse(
                    context,
                    StatusCodes.Status500InternalServerError,
                    "An unexpected error occurred.");
            }
        }

        private static async Task WriteResponse(
            HttpContext context,
            int statusCode,
            string message)
        {
            if (context.Response.HasStarted)
            {
                throw new InvalidOperationException(
                    "The response has already started.");
            }

            context.Response.Clear();
            context.Response.StatusCode = statusCode;
            context.Response.ContentType = "application/problem+json";

            await context.Response.WriteAsJsonAsync(new ProblemDetails
            {
                Status = statusCode,

                Title = statusCode switch
                {
                    StatusCodes.Status400BadRequest => "Bad Request",
                    StatusCodes.Status409Conflict => "Conflict",
                    StatusCodes.Status404NotFound => "Not Found",
                    StatusCodes.Status401Unauthorized => "Unauthorized",
                    _ => "Server Error"
                },

                Detail = message

            });
        }
    }

}
