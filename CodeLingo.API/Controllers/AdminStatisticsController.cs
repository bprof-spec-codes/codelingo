using CodeLingo.API.DTOs.Admin;
using CodeLingo.API.Models;
using CodeLingo.API.Repositories;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace CodeLingo.API.Controllers
{
    [Route("api/admin/statistics")]
    [ApiController]
    [Authorize(Roles = "Admin")]
    public class AdminStatisticsController : ControllerBase
    {
        private readonly IQuestionRepository _questionRepository;
        private readonly ISessionRepository _sessionRepository;
        private readonly UserManager<User> _userManager;

        public AdminStatisticsController(
            IQuestionRepository questionRepository,
            ISessionRepository sessionRepository,
            UserManager<User> userManager)
        {
            _questionRepository = questionRepository;
            _sessionRepository = sessionRepository;
            _userManager = userManager;
        }

        [HttpGet("dashboard")]
        public async Task<ActionResult<DashboardStatisticsDto>> GetDashboardStatistics()
        {
            var totalQuestions = await _questionRepository.CountQuestionsAsync(null, null, null);
            var totalUsers = await _userManager.Users.CountAsync();
            var sessionsThisWeek = await _sessionRepository.CountSessionsAsync(DateTime.UtcNow.AddDays(-7));

            return Ok(new DashboardStatisticsDto
            {
                TotalQuestions = totalQuestions,
                TotalUsers = totalUsers,
                SessionsThisWeek = sessionsThisWeek
            });
        }
    }
}
