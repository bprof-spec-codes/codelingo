using CodeLingo.API.Data;
using CodeLingo.API.Models;
using Microsoft.EntityFrameworkCore;

namespace CodeLingo.API.Repositories
{
    public class LanguageRepository : ILanguageRepository
    {
        private readonly AppDbContext _context;

        public LanguageRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<ProgrammingLanguage>> GetAllAsync()
        {
            return await _context.ProgrammingLanguages.ToListAsync();
        }

        public async Task<ProgrammingLanguage?> GetByIdAsync(int id)
        {
            return await _context.ProgrammingLanguages.FindAsync(id);
        }

        public async Task<ProgrammingLanguage> AddAsync(ProgrammingLanguage language)
        {
            _context.ProgrammingLanguages.Add(language);
            await _context.SaveChangesAsync();
            return language;
        }

        public async Task UpdateAsync(ProgrammingLanguage language)
        {
            _context.Entry(language).State = EntityState.Modified;
            await _context.SaveChangesAsync();
        }

        public async Task DeleteAsync(int id)
        {
            var language = await _context.ProgrammingLanguages.FindAsync(id);
            if (language != null)
            {
                _context.ProgrammingLanguages.Remove(language);
                await _context.SaveChangesAsync();
            }
        }

        public async Task<bool> ExistsAsync(int id)
        {
            return await _context.ProgrammingLanguages.AnyAsync(l => l.Id == id);
        }
    }
}
