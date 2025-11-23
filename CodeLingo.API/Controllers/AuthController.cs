using CodeLingo.API.Logics;
using CodeLingo.API.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace CodeLingo.API.Controllers
{
    [Route("api/auth")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly AuthLogic _authLogic;
        private readonly UserManager<User> _userManager;

        public AuthController(AuthLogic authLogic, UserManager<User> userManager)
        {
            _authLogic = authLogic;
            _userManager = userManager;
        }
    }
}
