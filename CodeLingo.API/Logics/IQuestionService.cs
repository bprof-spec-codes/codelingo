using CodeLingo.API.DTOs;
using static CodeLingo.API.DTOs.Admin.QuestionImportExportDtos;

namespace CodeLingo.API.Logics
{
    public interface IQuestionService
    {
        Task<QuestionResponseDto> CreateQuestionAsync(QuestionCreateDto dto, string userId);
        Task<QuestionResponseDto> UpdateQuestionAsync(string id, QuestionUpdateDto dto, string userId);
        Task DeleteQuestionAsync(string id);
        Task<QuestionResponseDto> GetQuestionAsync(string id);
        Task<QuestionListResponseDto> GetQuestionsAsync(string? language, string? difficulty, string? type, int page, int pageSize);

        Task<QuestionImportReportDto> ImportFromCsvAsync(Stream csvStream, string userId);

        Task<QuestionImportReportDto> ImportFromAikenAsync(Stream aikenStream, string userId, string language, string difficulty);

        Task<IReadOnlyList<QuestionResponseDto>> GetAllQuestionsAsync();
    }
}