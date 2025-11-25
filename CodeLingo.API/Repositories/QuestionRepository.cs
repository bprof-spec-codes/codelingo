using CodeLingo.API.Data;
using CodeLingo.API.DTOs.Exceptions;
using CodeLingo.API.Models;
using static CodeLingo.API.Models.Enums;
using Microsoft.EntityFrameworkCore;
using System;

namespace CodeLingo.API.Repositories
{
    public class QuestionRepository : IQuestionRepository
    {
        private AppDbContext appDbContext;
        private Random random = new Random();
        public QuestionRepository(AppDbContext appDbContext)
        {
            this.appDbContext = appDbContext;
        }

        public void Create(Question entity)
        {
            appDbContext.Questions.Add(entity);
        }

        public void Delete(Question entity)
        {
            appDbContext.Questions.Remove(entity);
        }

        public Question Read(string id)
        {
            return appDbContext.Questions.FirstOrDefault(q => q.Id == id);
        }

        public List<Question> ReadAll()
        {
            return appDbContext.Questions.ToList();
        }

        public void SaveChanges()
        {
            appDbContext.SaveChanges();
        }

        public List<Question> getRandomQuestions(int count, string language, DifficultyLevel difficulty)
        {
            var questionList = appDbContext.Questions.Where(q => q.Language == language && q.Difficulty == difficulty).ToList();
            // Step 1: Get total count(efficient query: SELECT COUNT(*) FROM Users)
            var totalCount = questionList.Count();

            if (totalCount == 0)
            {
                throw new NotSufficientQuestionsException("Nincs elegendő kérdés ezen a nyelven és nehézségen");
            }

            if (totalCount < count)
            {
                count = totalCount;
            }

            // Step 2: Calculate random skip (ensure we don't skip beyond total - count)
            var skip = random.Next(0, Math.Max(1, totalCount - count + 1));

            // Step 3: Skip random offset and take N (translates to SQL with ROW_NUMBER() or OFFSET/FETCH)
            // Optional: Add .OrderBy(u => 
            var randomQuestions = questionList
                .OrderBy(u => u.Id) // Helps distribute if IDs are sequential
            .Skip(skip)
            .Take(count)
            .ToList();
            return randomQuestions;

        }

        public async Task<IEnumerable<Question>> GetQuestionsAsync(string? language, DifficultyLevel? difficulty, QuestionType? type, int page, int pageSize)
        {
            var query = appDbContext.Questions.AsQueryable();

            if (!string.IsNullOrEmpty(language))
                query = query.Where(q => q.Language == language);

            if (difficulty.HasValue)
                query = query.Where(q => q.Difficulty == difficulty.Value);

            if (type.HasValue)
                query = query.Where(q => q.Type == type.Value);

            return await query
                .OrderByDescending(q => q.CreatedAt)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();
        }

        public async Task<int> CountQuestionsAsync(string? language, DifficultyLevel? difficulty, QuestionType? type)
        {
            var query = appDbContext.Questions.AsQueryable();

            if (!string.IsNullOrEmpty(language))
                query = query.Where(q => q.Language == language);

            if (difficulty.HasValue)
                query = query.Where(q => q.Difficulty == difficulty.Value);

            if (type.HasValue)
                query = query.Where(q => q.Type == type.Value);

            return await query.CountAsync();
        }

        public async Task<Question?> GetByIdAsync(string id)
        {
            return await appDbContext.Questions.FirstOrDefaultAsync(q => q.Id == id);
        }
    }
}
