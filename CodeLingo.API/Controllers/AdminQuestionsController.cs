using CodeLingo.API.DTOs;
using CodeLingo.API.Logics;
using CodeLingo.API.Repositories;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace CodeLingo.API.Controllers
{
    [Route("api/admin/questions")]
    [ApiController]
    [Authorize(Roles = "Admin")]
    public class AdminQuestionsController : ControllerBase
    {
        private readonly IQuestionService _questionService;
        private readonly IAuditLogRepository _auditLogRepository;

        public AdminQuestionsController(IQuestionService questionService, IAuditLogRepository auditLogRepository)
        {
            _questionService = questionService;
            _auditLogRepository = auditLogRepository;
        }

        [HttpGet]
        public async Task<ActionResult<QuestionListResponseDto>> GetQuestions(
            [FromQuery] string? language,
            [FromQuery] string? difficulty,
            [FromQuery] string? type,
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 20)
        {
            var result = await _questionService.GetQuestionsAsync(language, difficulty, type, page, pageSize);
            return Ok(result);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<QuestionResponseDto>> GetQuestion(string id)
        {
            try
            {
                var result = await _questionService.GetQuestionAsync(id);
                return Ok(result);
            }
            catch (KeyNotFoundException)
            {
                return NotFound();
            }
        }

        [HttpPost]
        public async Task<ActionResult<QuestionResponseDto>> CreateQuestion([FromBody] QuestionCreateDto dto)
        {
            try
            {
                var userId = User.FindFirstValue(ClaimTypes.NameIdentifier) ?? "admin";
                var result = await _questionService.CreateQuestionAsync(dto, userId);
                await _auditLogRepository.LogAsync(userId, "Create", "Question", result.Id, $"Created question: {result.Title}");
                return CreatedAtAction(nameof(GetQuestion), new { id = result.Id }, result);
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new { error = ex.Message });
            }
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<QuestionResponseDto>> UpdateQuestion(string id, [FromBody] QuestionUpdateDto dto)
        {
            try
            {
                var userId = User.FindFirstValue(ClaimTypes.NameIdentifier) ?? "admin";
                var result = await _questionService.UpdateQuestionAsync(id, dto, userId);
                await _auditLogRepository.LogAsync(userId, "Update", "Question", id, $"Updated question: {result.Title}");
                return Ok(result);
            }
            catch (KeyNotFoundException)
            {
                return NotFound();
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new { error = ex.Message });
            }
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteQuestion(string id)
        {
            try
            {
                await _questionService.DeleteQuestionAsync(id);
                var userId = User.FindFirstValue(ClaimTypes.NameIdentifier) ?? "admin";
                await _auditLogRepository.LogAsync(userId, "Delete", "Question", id, "Deleted question");
                return NoContent();
            }
            catch (KeyNotFoundException)
            {
                return NotFound();
            }
        }
    }
}
