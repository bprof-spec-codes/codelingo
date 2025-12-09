using CodeLingo.API.DTOs;

namespace CodeLingo.API.Logics
{
    public interface IQuestionService
    {
        Task<QuestionResponseDto> CreateQuestionAsync(QuestionCreateDto dto, string userId);
        Task<QuestionResponseDto> UpdateQuestionAsync(string id, QuestionUpdateDto dto, string userId);
        Task DeleteQuestionAsync(string id);
        Task<QuestionResponseDto> GetQuestionAsync(string id);
        Task<QuestionListResponseDto> GetQuestionsAsync(string? language, string? difficulty, string? type, string? title, string? questionText, int page, int pageSize);
    }
}
