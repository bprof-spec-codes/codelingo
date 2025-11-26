using CodeLingo.API.Models;

namespace CodeLingo.API.Repositories
{
    public interface ILanguageRepository
    {
        Task<IEnumerable<ProgrammingLanguage>> GetAllAsync();
        Task<ProgrammingLanguage?> GetByIdAsync(int id);
        Task<ProgrammingLanguage> AddAsync(ProgrammingLanguage language);
        Task UpdateAsync(ProgrammingLanguage language);
        Task DeleteAsync(int id);
        Task<bool> ExistsAsync(int id);
    }
}
