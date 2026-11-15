using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Sprouty.Application.DTOs.Notifications;
using Sprouty.Application.Interfaces;
using System;
using System.Collections.Generic;
using System.Security.Claims;
using System.Threading;
using System.Threading.Tasks;

namespace Sprouty.Api.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class NotificationsController : ControllerBase
    {
        private readonly INotificationService _notificationService;

        public NotificationsController(INotificationService notificationService)
        {
            _notificationService = notificationService;
        }

        
        // عرض إشعارات المستخدم الحالي
     
        [HttpGet]
        public async Task<ActionResult<IEnumerable<NotificationResponseDto>>> GetUserNotifications(
            CancellationToken cancellationToken)
        {
            var userId = GetCurrentUserId();
            var notifications = await _notificationService.GetUserNotificationsAsync(userId, cancellationToken);
            return Ok(notifications);
        }

        // تحديد إشعار معين كمقروء
      
        [HttpPatch("{id:guid}/read")]
        public async Task<IActionResult> MarkAsRead(
            Guid id,
            CancellationToken cancellationToken)
        {
            var userId = GetCurrentUserId();
            await _notificationService.MarkAsReadAsync(id, userId, cancellationToken);
            return NoContent();
        }

        private Guid GetCurrentUserId()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value
                           ?? User.FindFirst("sub")?.Value;

            if (string.IsNullOrEmpty(userIdClaim) || !Guid.TryParse(userIdClaim, out var userId))
            {
                throw new UnauthorizedAccessException("User ID claim is missing or invalid.");
            }

            return userId;
        }
    }
}