using CodeLingo.API.Logics;
using CodeLingo.API.Models;
using Microsoft.AspNetCore.Mvc;
using static CodeLingo.API.DTOs.Session.SessionDtos;

namespace CodeLingo.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SessionController : ControllerBase
    {
        private SessionLogic sessionLogic;
        public SessionController(SessionLogic sessionLogic)
        {
            this.sessionLogic = sessionLogic;
        }
        [HttpPost("create")]
        public void Create([FromBody] StartSessionRequestDto session)
        {
            sessionLogic.Create(session);
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
