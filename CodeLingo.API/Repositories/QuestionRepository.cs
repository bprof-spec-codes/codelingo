using CodeLingo.API.Data;
using CodeLingo.API.Models;
using Microsoft.EntityFrameworkCore.Metadata.Internal;
using System;

namespace CodeLingo.API.Repositories
{
    public class QuestionRepository
    {
        private AppDbContext appDbContext;
        private Random random = new Random();
        public QuestionRepository(AppDbContext appDbContext)
        {
            this.appDbContext = appDbContext;
        }

        public List<Question> getRandomQuestions(int count)
        {
            // Step 1: Get total count(efficient query: SELECT COUNT(*) FROM Users)
            var totalCount = appDbContext.Questions.Count();

            // Step 2: Calculate random skip (ensure we don't skip beyond total - count)
            var skip = random.Next(0, Math.Max(1, totalCount - count + 1));

            // Step 3: Skip random offset and take N (translates to SQL with ROW_NUMBER() or OFFSET/FETCH)
            // Optional: Add .OrderBy(u => 
            var randomQuestions = appDbContext.Questions
                .OrderBy(u => u.Id) // Helps distribute if IDs are sequential
            .Skip(skip)
            .Take(count)
            .ToList();
            return randomQuestions;

        }

    }
}
