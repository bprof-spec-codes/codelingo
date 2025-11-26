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
    }
}
