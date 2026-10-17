using AuraStudio.API.DTOs;
using AuraStudio.API.Services;
using Microsoft.AspNetCore.Mvc;

namespace AuraStudio.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;

        public AuthController(IAuthService authService)
        {
            _authService = authService;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterDto dto)
        {
            var result = await _authService.RegisterAsync(dto);
            if (!result.Success) return BadRequest(result);
            return Ok(result);
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginDto dto)
        {
            var result = await _authService.LoginAsync(dto);
            if (!result.Success) return Unauthorized(result);
            return Ok(result);
        }

        [HttpGet("profile/{userId}")]
        public async Task<IActionResult> GetProfile(int userId)
        {
            var profile = await _authService.GetProfileAsync(userId);
            if (profile == null) return NotFound(new { message = "User profile not found." });
            return Ok(profile);
        }
    }
}
