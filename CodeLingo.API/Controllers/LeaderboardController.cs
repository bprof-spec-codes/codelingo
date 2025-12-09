using CodeLingo.API.Logics;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using static CodeLingo.API.DTOs.Leaderboard.LeaderboardDtos;

namespace CodeLingo.API.Controllers
{
    [Route("api/leaderboard")]
    [ApiController]
    [Authorize]
    public class LeaderboardController : ControllerBase
    {
        private readonly LeaderboardLogic _leaderboardLogic;
        private readonly ILogger<LeaderboardController> _logger;

        public LeaderboardController(LeaderboardLogic leaderboardLogic, ILogger<LeaderboardController> logger)
        {
            _leaderboardLogic = leaderboardLogic;
            _logger = logger;
        }

        /// <summary>
        /// Get global or filtered leaderboard
        /// </summary>
        /// <param name="language">Filter by programming language (optional)</param>
        /// <param name="difficulty">Filter by difficulty level (optional)</param>
        /// <param name="page">Page number (default: 1)</param>
        /// <param name="pageSize">Records per page (default: 20, max: 100)</param>
        /// <returns>Leaderboard with rankings and current user context</returns>
        [HttpGet]
        public async Task<ActionResult<LeaderboardDto>> GetLeaderboard(
            [FromQuery] string? language = null,
            [FromQuery] string? difficulty = null,
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 20)
        {
            try
            {
                var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

                if (string.IsNullOrEmpty(userId))
                {
                    return Unauthorized(new { error = "Missing or invalid authentication token" });
                }

                // Validate query parameters
                if (page < 1)
                {
                    return BadRequest(new { error = "Invalid query parameters: page must be >= 1" });
                }

                if (pageSize < 1 || pageSize > 100)
                {
                    return BadRequest(new { error = "Invalid query parameters: pageSize must be between 1 and 100" });
                }

                var leaderboard = await _leaderboardLogic.GetLeaderboardAsync(
                    userId,
                    language,
                    difficulty,
                    page,
                    pageSize);

                return Ok(leaderboard);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving leaderboard");
                return StatusCode(500, new { error = "Internal server error" });
            }
        }
    }
}
