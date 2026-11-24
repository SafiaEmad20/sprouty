using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Sprouty.Application.Interfaces;

namespace Sprouty.Api.Middleware
{
    // التوكن ممكن يكون سليم بس صاحبه اتمسح (مثلًا بعد ما الداتابيز اتعملت من جديد).
    // في الحالة دي بنرجع 401، فالفرونت يطلّع المستخدم يعمل Login تاني بدل ما يحصل 500.
    public class UserExistsMiddleware
    {
        private readonly RequestDelegate _next;

        public UserExistsMiddleware(RequestDelegate next)
        {
            _next = next;
        }

        public async Task InvokeAsync(HttpContext context, IUserRepository userRepository)
        {
            // Only routes that need a login are checked. Public routes (login, register,
            // plant types) keep working even if the browser still sends an old token.
            var endpoint = context.GetEndpoint();
            var needsLogin = endpoint?.Metadata.GetMetadata<IAuthorizeData>() is not null
                             && endpoint.Metadata.GetMetadata<IAllowAnonymous>() is null;

            if (needsLogin && context.User.Identity?.IsAuthenticated == true)
            {
                var userIdClaim = context.User.FindFirst(ClaimTypes.NameIdentifier)?.Value
                                  ?? context.User.FindFirst("sub")?.Value;

                if (!Guid.TryParse(userIdClaim, out var userId) ||
                    !await userRepository.ExistsAsync(userId, context.RequestAborted))
                {
                    context.Response.StatusCode = StatusCodes.Status401Unauthorized;
                    context.Response.Headers.WWWAuthenticate = "Bearer error=\"invalid_token\"";
                    return;
                }
            }

            await _next(context);
        }
    }
}
