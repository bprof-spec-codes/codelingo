using CodeLingo.API.Logics;
using CodeLingo.API.Models;
using Microsoft.AspNetCore.Authorization;
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
                ExpiresIn = _authLogic.GetTokenExpiresInSeconds(),
                IsAdmin = await _authLogic.IsInRoleAsync(user, AppRoles.Admin)
            });
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequestDto request)
        {
            if (!ModelState.IsValid)
            {
                return Unauthorized(new { error = "Invalid credentials" });
            }

            // Find user by username
            var user = await _authLogic.GetUserByUsernameAsync(request.Username);

            if (user == null)
            {
                return Unauthorized(new { error = "Invalid credentials" });
            }

            // Verify password using UserManager
            var passwordValid = await _userManager.CheckPasswordAsync(user, request.Password);

            if (!passwordValid || !user.IsActive)
            {
                return Unauthorized(new { error = "Invalid credentials" });
            }

            // Generate tokens
            var accessToken = await _authLogic.GenerateJwtTokenAsync(user);
            var refreshToken = await _authLogic.GenerateRefreshTokenAsync(user.Id);

            return Ok(new AuthResponseDto
            {
                Message = "Login successful",
                UserId = user.Id,
                AccessToken = accessToken,
                RefreshToken = refreshToken.Token,
                ExpiresIn = _authLogic.GetTokenExpiresInSeconds(),
                IsAdmin = await _authLogic.IsInRoleAsync(user, AppRoles.Admin)
            });
        }

        [HttpPost("token/refresh")]
        public async Task<IActionResult> RefreshToken([FromBody] RefreshTokenRequestDto request)
        {
            if (!ModelState.IsValid)
            {
                return Unauthorized(new { error = "Invalid or expired refresh token" });
            }

            // Validate refresh token
            var refreshToken = await _authLogic.GetRefreshTokenAsync(request.RefreshToken);

            if (refreshToken == null || !refreshToken.IsActive)
            {
                return Unauthorized(new { error = "Invalid or expired refresh token" });
            }

            // Generate new access token
            var accessToken = await _authLogic.GenerateJwtTokenAsync(refreshToken.User);

            return Ok(new TokenResponseDto
            {
                AccessToken = accessToken,
                ExpiresIn = _authLogic.GetTokenExpiresInSeconds(),
                IsAdmin = await _authLogic.IsInRoleAsync(refreshToken.User, AppRoles.Admin)
            });
        }

        // Admin endpoint to promote user to admin role
        [Authorize(Roles = AppRoles.Admin)]
        [HttpPost("promote-to-admin/{userId}")]
        public async Task<IActionResult> PromoteToAdmin(string userId)
        {
            var user = await _userManager.FindByIdAsync(userId);
            if (user == null)
            {
                return NotFound(new { error = "User not found" });
            }

            var result = await _authLogic.AddToRoleAsync(user, AppRoles.Admin);
            if (!result.Succeeded)
            {
                return BadRequest(new { error = "Failed to promote user to admin" });
            }

            return Ok(new { message = $"User {user.UserName} promoted to admin successfully" });
        }
    }
}
