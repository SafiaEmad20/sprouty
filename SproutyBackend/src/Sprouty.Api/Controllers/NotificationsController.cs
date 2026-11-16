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
     
        // ?unreadOnly=true يرجع الإشعارات اللي لسه متقريتش بس
        [HttpGet]
        public async Task<ActionResult<IEnumerable<NotificationResponseDto>>> GetUserNotifications(
            [FromQuery] bool unreadOnly = false,
            CancellationToken cancellationToken = default)
        {
            var userId = GetCurrentUserId();
            var notifications = await _notificationService.GetUserNotificationsAsync(userId, unreadOnly, cancellationToken);
            return Ok(notifications);
        }

        // عدد الإشعارات اللي لسه متقريتش
        [HttpGet("unread-count")]
        public async Task<ActionResult<UnreadCountResponseDto>> GetUnreadCount(
            CancellationToken cancellationToken)
        {
            var userId = GetCurrentUserId();
            var result = await _notificationService.GetUnreadCountAsync(userId, cancellationToken);
            return Ok(result);
        }

        // تحديد إشعار معين كمقروء
      
        // PATCH و PUT الاتنين شغالين (الفرونت بيبعت PUT)
        [HttpPatch("{id:guid}/read")]
        [HttpPut("{id:guid}/read")]
        public async Task<IActionResult> MarkAsRead(
            Guid id,
            CancellationToken cancellationToken)
        {
            var userId = GetCurrentUserId();
            await _notificationService.MarkAsReadAsync(id, userId, cancellationToken);
            return NoContent();
        }

        // تحديد كل الإشعارات كمقروءة
        [HttpPatch("read-all")]
        [HttpPut("read-all")]
        public async Task<ActionResult<MarkAllReadResponseDto>> MarkAllAsRead(
            CancellationToken cancellationToken)
        {
            var userId = GetCurrentUserId();
            var result = await _notificationService.MarkAllAsReadAsync(userId, cancellationToken);
            return Ok(result);
        }

        // حذف إشعار
        [HttpDelete("{id:guid}")]
        public async Task<IActionResult> Delete(
            Guid id,
            CancellationToken cancellationToken)
        {
            var userId = GetCurrentUserId();
            await _notificationService.DeleteAsync(id, userId, cancellationToken);
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