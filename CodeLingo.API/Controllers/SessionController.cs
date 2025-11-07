using CodeLingo.API.Logics;
using CodeLingo.API.Models;
using Microsoft.AspNetCore.Mvc;

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
        [HttpGet]
        public void Create([FromBody] Session session)
        {
            sessionLogic.Create(session);
        }
    }
}
