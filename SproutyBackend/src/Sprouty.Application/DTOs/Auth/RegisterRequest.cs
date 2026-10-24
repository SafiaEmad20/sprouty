
using System.ComponentModel.DataAnnotations;

namespace Sprouty.Application.DTOs.Auth;

public class RegisterRequest
{
    [Required]
    [StringLength(100, MinimumLength = 2)]
    public string Name { get; set; } = string.Empty;

    [Required]
    [EmailAddress]
    [StringLength(256)]
    public string Email { get; set; } = string.Empty;

    [Required]
    [MinLength(8)]
    [StringLength(128)]
    public string Password { get; set; } = string.Empty;
}
