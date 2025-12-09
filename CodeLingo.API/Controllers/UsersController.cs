using CodeLingo.API.Models;
using CodeLingo.API.Repositories;
using CodeLingo.API.DTOs.User;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using static CodeLingo.API.DTOs.User.UserDtos;

namespace CodeLingo.API.Controllers
{
    [Route("api/users")]
    [ApiController]
    [Authorize]
    public class UsersController : ControllerBase
    {
        private readonly UserManager<User> _userManager;
        private readonly ISessionRepository _sessionRepository;

        public UsersController(UserManager<User> userManager, ISessionRepository sessionRepository)
        {
            _userManager = userManager;
            _sessionRepository = sessionRepository;
        }

        /// <summary>
        /// Get the current user's profile
        /// </summary>
        [HttpGet("me")]
        public async Task<ActionResult<UserProfileDto>> GetProfile()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            
            if (string.IsNullOrEmpty(userId))
            {
                return Unauthorized(new { error = "User not authenticated" });
            }

            var user = await _userManager.FindByIdAsync(userId);
            
            if (user == null)
            {
                return NotFound(new { error = "User not found" });
            }

            var profile = new UserProfileDto
            {
                UserId = user.Id,
                Username = user.UserName ?? string.Empty,
                Email = user.Email ?? string.Empty,
                FirstName = user.FirstName ?? string.Empty,
                LastName = user.LastName ?? string.Empty,
                ProfilePictureUrl = user.ProfilePictureUrl
            };

            return Ok(profile);
        }

        /// <summary>
        /// Update the current user's profile
        /// </summary>
        [HttpPut("me")]
        public async Task<IActionResult> UpdateProfile([FromBody] UpdateUserProfileDto updateDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(new { error = "Invalid profile data" });
            }

            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            
            if (string.IsNullOrEmpty(userId))
            {
                return Unauthorized(new { error = "User not authenticated" });
            }

            var user = await _userManager.FindByIdAsync(userId);
            
            if (user == null)
            {
                return NotFound(new { error = "User not found" });
            }

            // Check if username is being changed and if it's already taken
            if (user.UserName != updateDto.Username)
            {
                var existingUser = await _userManager.FindByNameAsync(updateDto.Username);
                if (existingUser != null && existingUser.Id != userId)
                {
                    return BadRequest(new { error = "Username already taken" });
                }
                user.UserName = updateDto.Username;
            }

            // Check if email is being changed and if it's already taken
            if (user.Email != updateDto.Email)
            {
                var existingUser = await _userManager.FindByEmailAsync(updateDto.Email);
                if (existingUser != null && existingUser.Id != userId)
                {
                    return BadRequest(new { error = "Email already in use" });
                }
                user.Email = updateDto.Email;
            }

            // Update profile fields
            user.FirstName = updateDto.FirstName;
            user.LastName = updateDto.LastName;
            user.ProfilePictureUrl = updateDto.ProfilePictureUrl;
            user.UpdatedAt = DateTime.UtcNow;

            var result = await _userManager.UpdateAsync(user);

            if (!result.Succeeded)
            {
                var errors = string.Join(", ", result.Errors.Select(e => e.Description));
                return BadRequest(new { error = $"Failed to update profile: {errors}" });
            }

            return Ok(new { message = "Profile updated successfully" });
        }

        /// <summary>
        /// Get the current user's statistics
        /// </summary>
        [HttpGet("me/statistics")]
        public async Task<ActionResult<UserStatisticsDto>> GetStatistics()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (string.IsNullOrEmpty(userId))
            {
                return Unauthorized(new { error = "User not authenticated" });
            }

            var sessions = await _sessionRepository.GetSessionsByUserId(userId);

            var weeklySessions = sessions
                .Where(s => s.CreatedAt >= DateTime.UtcNow.AddDays(-7))
                .ToList();

            var totalQuestionsAnswered = weeklySessions
                .SelectMany(s => s.SessionQuestions)
                .Count(sq => sq.Answered);

            var correctAnswers = weeklySessions
                .SelectMany(s => s.SessionQuestions)
                .Count(sq => sq.Correct);

            var accuracy = totalQuestionsAnswered > 0
                ? (double)correctAnswers / totalQuestionsAnswered * 100
                : 0;

            // Calculate streak (consecutive days with at least one session)
            var streak = 0;
            var today = DateTime.UtcNow.Date;
            var sessionDates = sessions
                .Select(s => s.CreatedAt.Date)
                .Distinct()
                .OrderByDescending(d => d)
                .ToList();

            if (sessionDates.Any())
            {
                // Check if there is a session today or yesterday to start the streak
                if (sessionDates.Contains(today) || sessionDates.Contains(today.AddDays(-1)))
                {
                    streak = 1;
                    var currentDate = sessionDates.Contains(today) ? today : today.AddDays(-1);

                    for (int i = 1; i < sessionDates.Count; i++)
                    {
                        if (sessionDates[i] == currentDate.AddDays(-1))
                        {
                            streak++;
                            currentDate = currentDate.AddDays(-1);
                        }
                        else
                        {
                            break;
                        }
                    }
                }
            }

            var stats = new UserStatisticsDto
            {
                TotalQuestionsAnswered = totalQuestionsAnswered,
                Accuracy = Math.Round(accuracy, 1),
                CurrentStreak = streak,
                Rank = 42 // Placeholder for now
            };

            return Ok(stats);
        }
    }
}
