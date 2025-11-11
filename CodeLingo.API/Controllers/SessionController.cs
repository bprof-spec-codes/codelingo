using CodeLingo.API.Logics;
using CodeLingo.API.Models;
using Microsoft.AspNetCore.Mvc;
using static CodeLingo.API.DTOs.Session.SessionDtos;

namespace CodeLingo.API.Controllers
{
    [Route("api/session")]
    [ApiController]
    public class SessionController : ControllerBase
    {
        private readonly ILogger<SessionController> _logger;
        private SessionLogic sessionLogic;
        public SessionController(SessionLogic sessionLogic, ILogger<SessionController> logger)
        {
            this.sessionLogic = sessionLogic;
            _logger = logger;
        }
        [HttpPost("start")]
        public StartSessionResponseDto Create([FromBody] StartSessionRequestDto session)
        {
            // TODO: Authentication fill user ID
            _logger.LogInformation("Session creation started");
            StartSessionResponseDto response = sessionLogic.Create(session);
            _logger.LogInformation("Session created");
            return response;
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

    }
}
