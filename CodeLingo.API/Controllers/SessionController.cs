using CodeLingo.API.Logics;
using CodeLingo.API.Models;
using Microsoft.AspNetCore.Mvc;
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
        public ActionResult<StartSessionResponseDto> Create([FromBody] StartSessionRequestDto session)
        {
            try
            {
                // TODO: Authentication fill user ID
                _logger.LogInformation("Session creation started");
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
        public void Update([FromBody] Session session) 
        { 
            this.sessionLogic.Update(session);
        }

        [HttpDelete("delete")]
        public void Delete([FromBody] Session session) 
        { 
            this.sessionLogic.Delete(session);
        }
        [HttpGet("read")]
        public Session Read(string id)
        {
            return this.sessionLogic.Read(id);
        }
        [HttpGet("read-all")]
        public List<Session> ReadAll()
        {
           return this.sessionLogic.ReadAll();
        }
        [HttpPost("{sessionId}/answer")]
        public IActionResult answer(string sessionId, [FromBody] JsonElement json)
        {
            if (!sessionLogic.IsValidSessionId(sessionId))
            {
                return NotFound("Session not found or already completed");
            }

            try
            {
                return Ok(answerEvaluationLogic.EvaluateAnswer(json));
            }
            catch(Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
        [HttpGet("{id}/next")]
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
