using CodeLingo.API.DTOs;
using CodeLingo.API.Models;
using CodeLingo.API.Repositories;

namespace CodeLingo.API.Logics
{
    public class LanguageService : ILanguageService
    {
        private readonly ILanguageRepository _repository;

        public LanguageService(ILanguageRepository repository)
        {
            _repository = repository;
        }

        public async Task<IEnumerable<LanguageResponseDto>> GetAllLanguagesAsync()
        {
            var languages = await _repository.GetAllAsync();
            return languages.Select(l => new LanguageResponseDto
            {
                Id = l.Id,
                Name = l.Name,
                ShortCode = l.ShortCode,
                Version = l.Version
            });
        }

        public async Task<LanguageResponseDto> GetLanguageByIdAsync(int id)
        {
            var language = await _repository.GetByIdAsync(id);
            if (language == null)
            {
                throw new KeyNotFoundException($"Language with ID {id} not found.");
            }

            return new LanguageResponseDto
            {
                Id = language.Id,
                Name = language.Name,
                ShortCode = language.ShortCode,
                Version = language.Version
            };
        }

        public async Task<LanguageResponseDto> CreateLanguageAsync(LanguageCreateDto dto)
        {
            var language = new ProgrammingLanguage
            {
                Name = dto.Name,
                ShortCode = dto.ShortCode,
                Version = dto.Version
            };

            var createdLanguage = await _repository.AddAsync(language);

            return new LanguageResponseDto
            {
                Id = createdLanguage.Id,
                Name = createdLanguage.Name,
                ShortCode = createdLanguage.ShortCode,
                Version = createdLanguage.Version
            };
        }

        public async Task<LanguageResponseDto> UpdateLanguageAsync(int id, LanguageUpdateDto dto)
        {
            var language = await _repository.GetByIdAsync(id);
            if (language == null)
            {
                throw new KeyNotFoundException($"Language with ID {id} not found.");
            }

            if (dto.Name != null) language.Name = dto.Name;
            if (dto.ShortCode != null) language.ShortCode = dto.ShortCode;
            if (dto.Version != null) language.Version = dto.Version;

            await _repository.UpdateAsync(language);

            return new LanguageResponseDto
            {
                Id = language.Id,
                Name = language.Name,
                ShortCode = language.ShortCode,
                Version = language.Version
            };
        }

        public async Task DeleteLanguageAsync(int id)
        {
            if (!await _repository.ExistsAsync(id))
            {
                throw new KeyNotFoundException($"Language with ID {id} not found.");
            }

            await _repository.DeleteAsync(id);
        }
    }
}
