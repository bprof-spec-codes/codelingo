using CodeLingo.API.Models;
using static CodeLingo.API.Models.Enums;

namespace CodeLingo.API.Repositories
{
    public interface IQuestionRepository : IRepository<Question>
    {
        Task<IEnumerable<Question>> GetQuestionsAsync(string? language, DifficultyLevel? difficulty, QuestionType? type, string? title, string? questionText, int page, int pageSize);
        Task<int> CountQuestionsAsync(string? language, DifficultyLevel? difficulty, QuestionType? type, string? title, string? questionText);
        Task<Question?> GetByIdAsync(string id);
        List<Question> getRandomQuestions(int count, List<string> languageIds, DifficultyLevel difficulty);
    }
}
