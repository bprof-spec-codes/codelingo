using CodeLingo.API.DTOs;
using CodeLingo.API.Logics;
using CodeLingo.API.Repositories;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using System.Text;
using System.Text.Json;

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
            [FromQuery] string? title,
            [FromQuery] string? questionText,
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
        // POST api/admin/questions/import
        [HttpPost("import")]
        public async Task<IActionResult> ImportQuestions(
            IFormFile file,
            [FromQuery] string? format = null)
        {
            if (file == null || file.Length == 0)
            {
                return BadRequest(new
                {
                    error = "Invalid file or missing file"
                });
            }

            // ha nincs megadva format, próbáljuk a kiterjesztésből kitalálni
            format ??= Path.GetExtension(file.FileName).ToLowerInvariant() switch
            {
                ".csv" => "csv",
                _ => null
            };

            if (!string.Equals(format, "csv", StringComparison.OrdinalIgnoreCase))
            {
                return BadRequest(new
                {
                    error = "Only CSV format is supported in this version"
                });
            }

            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier) ?? "admin";

            using var stream = file.OpenReadStream();
            var report = await _questionService.ImportFromCsvAsync(stream, userId);

            await _auditLogRepository.LogAsync(
                userId,
                "Import",
                "Question",
                "BULK_IMPORT",
                $"Imported {report.ImportedCount} questions (failed: {report.FailedCount}) from file {file.FileName} (format=csv)");

            return Ok(report);
        }
        // GET api/admin/questions/export?format=csv|json
        [HttpGet("export")]
        public async Task<IActionResult> ExportQuestions([FromQuery] string format = "csv")
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier) ?? "admin";

            var questions = await _questionService.GetAllQuestionsAsync();

            if (format.Equals("json", StringComparison.OrdinalIgnoreCase))
            {
                var json = JsonSerializer.Serialize(questions);
                var bytes = Encoding.UTF8.GetBytes(json);

                await _auditLogRepository.LogAsync(
                    userId,
                    "Export",
                    "Question",
                    "BULK_EXPORT",
                    $"Exported {questions.Count} questions as JSON");

                return File(bytes, "application/json", "questions.json");
            }

            if (format.Equals("csv", StringComparison.OrdinalIgnoreCase))
            {
                var sb = new StringBuilder();

                sb.AppendLine("type,language,difficulty,title,questionText,explanation,options,starterCode,correctAnswer");

                foreach (var q in questions)
                {
                    var type = q.Type;
                    var difficulty = q.Difficulty;

                    string optionsJson = string.Empty;
                    string starterCode = string.Empty;
                    string correctAnswer = string.Empty;

                    // MC: options JSON
                    if (string.Equals(type, "MultipleChoice", StringComparison.OrdinalIgnoreCase)
                        && q.Options != null
                        && q.Options.Count > 0)
                    {
                        optionsJson = JsonSerializer.Serialize(q.Options);
                    }

                    // CC: starterCode + correctAnswer a Metadata-ból
                    if (string.Equals(type, "CodeCompletion", StringComparison.OrdinalIgnoreCase)
                        && q.Metadata != null)
                    {
                        try
                        {
                            if (q.Metadata.ContainsKey("starterCode"))
                            {
                                starterCode = q.Metadata["starterCode"]?.GetValue<string>() ?? string.Empty;
                            }

                            if (q.Metadata.ContainsKey("correctAnswer"))
                            {
                                correctAnswer = q.Metadata["correctAnswer"]?.GetValue<string>() ?? string.Empty;
                            }
                        }
                        catch
                        {
                            // ha valami fura a JSON-ben, max üresen megy ki
                        }
                    }

                    sb.AppendLine(string.Join(",",
                        EscapeCsv(type),
                        EscapeCsv(q.Language),
                        EscapeCsv(difficulty),
                        EscapeCsv(q.Title),
                        EscapeCsv(q.QuestionText),
                        EscapeCsv(q.Explanation),
                        EscapeCsv(optionsJson),
                        EscapeCsv(starterCode),
                        EscapeCsv(correctAnswer)
                    ));
                }

                var bytes = Encoding.UTF8.GetBytes(sb.ToString());

                await _auditLogRepository.LogAsync(
                    userId,
                    "Export",
                    "Question",
                    "BULK_EXPORT",
                    $"Exported {questions.Count} questions as CSV");

                return File(bytes, "text/csv", "questions.csv");
            }

            return BadRequest(new
            {
                error = "Invalid query parameters or unsupported export format"
            });
        }
        private string EscapeCsv(string? value)
        {
            if (string.IsNullOrEmpty(value))
                return string.Empty;

            var v = value.Replace("\"", "\"\"");

            if (v.Contains(',') || v.Contains('"') || v.Contains('\n') || v.Contains('\r'))
            {
                return $"\"{v}\"";
            }

            return v;
        }
    }
}
