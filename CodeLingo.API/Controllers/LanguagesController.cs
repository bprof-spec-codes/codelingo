using CodeLingo.API.DTOs;
using CodeLingo.API.Logics;
using CodeLingo.API.Repositories;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace CodeLingo.API.Controllers
{
    [Route("api/admin/languages")]
    [ApiController]
    [Authorize(Roles = "Admin")]
    public class LanguagesController : ControllerBase
    {
        private readonly ILanguageService _languageService;
        private readonly IAuditLogRepository _auditLogRepository;

        public LanguagesController(ILanguageService languageService, IAuditLogRepository auditLogRepository)
        {
            _languageService = languageService;
            _auditLogRepository = auditLogRepository;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<LanguageResponseDto>>> GetLanguages()
        {
            var languages = await _languageService.GetAllLanguagesAsync();
            return Ok(languages);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<LanguageResponseDto>> GetLanguage(int id)
        {
            try
            {
                var language = await _languageService.GetLanguageByIdAsync(id);
                return Ok(language);
            }
            catch (KeyNotFoundException)
            {
                return NotFound();
            }
        }

        [HttpPost]
        public async Task<ActionResult<LanguageResponseDto>> CreateLanguage([FromBody] LanguageCreateDto dto)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier) ?? "admin";
            var createdLanguage = await _languageService.CreateLanguageAsync(dto);
            await _auditLogRepository.LogAsync(userId, "Create", "Language", createdLanguage.Id.ToString(), $"Created language: {createdLanguage.Name}");
            return CreatedAtAction(nameof(GetLanguage), new { id = createdLanguage.Id }, createdLanguage);
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<LanguageResponseDto>> UpdateLanguage(int id, [FromBody] LanguageUpdateDto dto)
        {
            try
            {
                var userId = User.FindFirstValue(ClaimTypes.NameIdentifier) ?? "admin";
                var updatedLanguage = await _languageService.UpdateLanguageAsync(id, dto);
                await _auditLogRepository.LogAsync(userId, "Update", "Language", id.ToString(), $"Updated language: {updatedLanguage.Name}");
                return Ok(updatedLanguage);
            }
            catch (KeyNotFoundException)
            {
                return NotFound();
            }
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteLanguage(int id)
        {
            try
            {
                var userId = User.FindFirstValue(ClaimTypes.NameIdentifier) ?? "admin";
                await _languageService.DeleteLanguageAsync(id);
                await _auditLogRepository.LogAsync(userId, "Delete", "Language", id.ToString(), "Deleted language");
                return NoContent();
            }
            catch (KeyNotFoundException)
            {
                return NotFound();
            }
        }
    }
}
