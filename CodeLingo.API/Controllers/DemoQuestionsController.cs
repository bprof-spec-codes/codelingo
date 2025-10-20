using CodeLingo.API.Data;
using CodeLingo.API.DTOs;
using CodeLingo.API.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;


namespace CodeLingo.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class QuestionsController
    {
        private readonly AppDbContext _db;

        public QuestionsController(AppDbContext db)
        {
            _db = db;
        }

        [HttpGet("demo")]
        public async Task<ActionResult<QuestionDto>> GetDemoQuestion()
        {
            var entity = await _db.Questions
                .Include(q => q.ProgrammingLanguage)
                .OrderBy(q => q.Id)
                .FirstOrDefaultAsync();

            if (entity == null)
            {
                return new NotFoundResult();
            }

            var dto = new QuestionDto
            {
                Id = entity.Id,
                ProgrammingLanguageId = entity.ProgrammingLanguageId,
                ProgrammingLanguageName = entity.ProgrammingLanguage?.Name ?? "",
                QuestionText = entity.QuestionText,
                Option1 = entity.Option1,
                Option2 = entity.Option2,
                Option3 = entity.Option3,
                Option4 = entity.Option4,
                HardnessLevel = (int)entity.HardnessLevel,
                HardnessLevelText = entity.HardnessLevel.ToString()
            };

            return new OkObjectResult(dto);
        }
    }
}
