using CodeLingo.API.Logics;
using CodeLingo.API.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using static CodeLingo.API.DTOs.Auth.AuthDtos;

namespace CodeLingo.API.Controllers
{
    [Route("api/auth")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly AuthLogic _authLogic;
        private readonly UserManager<User> _userManager;

        public AuthController(AuthLogic authLogic, UserManager<User> userManager)
        {
            _authLogic = authLogic;
            _userManager = userManager;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterRequestDto request)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(new { error = "Missing required fields" });
            }

            // Check if username already exists
            if (await _authLogic.UsernameExistsAsync(request.Username))
            {
                return BadRequest(new { error = "Username already exists" });
            }

            // Create new user
            var user = new User
            {
                UserName = request.Username,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow,
                IsActive = true
            };

            var result = await _authLogic.CreateUserAsync(user, request.Password);

            if (!result.Succeeded)
            {
                var errors = string.Join(", ", result.Errors.Select(e => e.Description));
                return BadRequest(new { error = $"Registration failed: {errors}" });
            }

            // Generate tokens
            var accessToken = await _authLogic.GenerateJwtTokenAsync(user);
            var refreshToken = await _authLogic.GenerateRefreshTokenAsync(user.Id);

            return StatusCode(201, new AuthResponseDto
            {
                Message = "Registration successful",
                UserId = user.Id,
                AccessToken = accessToken,
                RefreshToken = refreshToken.Token,
                ExpiresIn = _authLogic.GetTokenExpiresInSeconds()
            });
        }
    }
}
