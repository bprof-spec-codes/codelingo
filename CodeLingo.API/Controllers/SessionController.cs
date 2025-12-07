using CodeLingo.API.Logics;
using CodeLingo.API.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using System.Text.Json;
using static CodeLingo.API.DTOs.Session.SessionDtos;


namespace CodeLingo.API.Controllers
{
    [Route("api/session")]
    [ApiController]
    public class SessionController : ControllerBase
    {
        private readonly ILogger<SessionController> _logger;
        private SessionLogic sessionLogic;
        private AnswerEvaluationLogic answerEvaluationLogic;
        public SessionController(SessionLogic sessionLogic, ILogger<SessionController> logger, AnswerEvaluationLogic answerEvaluationLogic)
        {
            this.sessionLogic = sessionLogic;
            _logger = logger;
            this.answerEvaluationLogic = answerEvaluationLogic;
        }
        [HttpPost("start")]
        [Authorize]
        public ActionResult<StartSessionResponseDto> Create([FromBody] StartSessionRequestDto session)
        {
            try
            {
                var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
                if (string.IsNullOrEmpty(userId))
                {
                    return Unauthorized(new { error = "User ID not found in token" });
                }
                session.UserId = userId;

                _logger.LogInformation("Session creation started for user {UserId}", userId);
                StartSessionResponseDto response = sessionLogic.Create(session);
                _logger.LogInformation("Session created");
                return Ok(response);
            }
            catch (CodeLingo.API.DTOs.Exceptions.NotSufficientQuestionsException ex)
            {
                _logger.LogWarning(ex, "Not enough questions available");
                return BadRequest(new { 
                    error = ex.Message,
                    availableCount = ex.AvailableCount,
                    requestedCount = ex.RequestedCount
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating session");
                return BadRequest(new { error = ex.Message });
            }
        }

        [HttpPut("update")]
        [Authorize]
        public void Update([FromBody] Session session) 
        { 
            this.sessionLogic.Update(session);
        }

        [HttpDelete("delete")]
        [Authorize]
        public void Delete([FromBody] Session session) 
        { 
            this.sessionLogic.Delete(session);
        }
        [HttpGet("read")]
        [Authorize]
        public Session Read(string id)
        {
            return this.sessionLogic.Read(id);
        }
        [HttpGet("read-all")]
        [Authorize]
        public List<Session> ReadAll()
        {
           return this.sessionLogic.ReadAll();
        }
        [HttpPost("{sessionId}/answer")]
        [Authorize]
        public IActionResult answer(string sessionId, [FromBody] JsonElement json)
        {
            if (!sessionLogic.IsValidSessionId(sessionId))
            {
                return NotFound("Session not found or already completed");
            }

            try
            {
                return Ok(answerEvaluationLogic.EvaluateAnswer(json, sessionId));
            }
            catch(Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
        [HttpGet("{id}/next")]
        [Authorize]
        public ActionResult<NextQuestionResponseDto> GetNextQuestion(string id)
        {
            _logger.LogInformation("Next question requested for session {SessionId}", id);
            var dto = sessionLogic.GetNextQuestion(id);
            if (dto == null)
                return NotFound(new { error = "Session not found or no more questions" });
            return Ok(dto);
        }

        [HttpPost("{id}/close")]
        [Authorize]
        public IActionResult CloseSession(string id, [FromBody] CloseSessionRequestDto? request)
        {
            try
            {
                var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
                if (string.IsNullOrEmpty(userId))
                {
                    _logger.LogWarning("Unauthorized close session attempt - missing user ID in token");
                    return Unauthorized(new { error = "Missing or invalid authentication token" });
                }

                _logger.LogInformation("Closing session {SessionId} for user {UserId}", id, userId);

                bool forceClose = request?.ForceClose ?? false;

                var summary = sessionLogic.CloseSession(id, userId, forceClose);

                _logger.LogInformation("Session {SessionId} closed successfully with status {Status}",
                    id, summary.Status);

                return Ok(summary);
            }
            catch (KeyNotFoundException ex)
            {
                _logger.LogWarning("Session {SessionId} not found", id);
                return NotFound(new { error = "Session not found" });
            }
            catch (UnauthorizedAccessException ex)
            {
                _logger.LogWarning(ex, "Forbidden: User attempted to close session {SessionId} they don't own", id);
                return StatusCode(403, new { error = "Not authorized to close this session" });
            }
            catch (InvalidOperationException ex)
            {
                _logger.LogWarning(ex, "Bad request closing session {SessionId}: {Message}", id, ex.Message);
                return BadRequest(new { error = "Session already closed or invalid state" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Internal server error closing session {SessionId}", id);
                return StatusCode(500, new { error = "Internal server error" });
            }
        }
    }
}
