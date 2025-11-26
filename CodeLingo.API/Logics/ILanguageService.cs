using CodeLingo.API.DTOs;

namespace CodeLingo.API.Logics
{
    public interface ILanguageService
    {
        Task<IEnumerable<LanguageResponseDto>> GetAllLanguagesAsync();
        Task<LanguageResponseDto> GetLanguageByIdAsync(int id);
        Task<LanguageResponseDto> CreateLanguageAsync(LanguageCreateDto dto);
        Task<LanguageResponseDto> UpdateLanguageAsync(int id, LanguageUpdateDto dto);
        Task DeleteLanguageAsync(int id);
    }
}
