using CodeLingo.API.DTOs;
using CodeLingo.API.Logics;
using Microsoft.AspNetCore.Mvc;

namespace CodeLingo.API.Controllers
{
    [Route("api/languages")]
    [ApiController]
    public class PublicLanguagesController : ControllerBase
    {
        private readonly ILanguageService _languageService;

        public PublicLanguagesController(ILanguageService languageService)
        {
            _languageService = languageService;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<LanguageResponseDto>>> GetLanguages()
        {
            var languages = await _languageService.GetAllLanguagesAsync();
            return Ok(languages);
        }
    }
}
