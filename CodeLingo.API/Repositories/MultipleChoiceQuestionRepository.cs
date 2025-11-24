using CodeLingo.API.Data;
using CodeLingo.API.Models;
using Microsoft.EntityFrameworkCore;

namespace CodeLingo.API.Repositories
{
    public class MultipleChoiceQuestionRepository : IMultipleChoiceQuestionRepository
    {
        private AppDbContext DbContext;

        public MultipleChoiceQuestionRepository(AppDbContext dbContext)
        {
                this.DbContext = dbContext;
        }
        public void Create(MultipleChoiceQuestion entity)
        {
            this.DbContext.MultipleChoiceQuestions.Add(entity);
        }

        public void Delete(MultipleChoiceQuestion entity)
        {
            this.DbContext.MultipleChoiceQuestions.Remove(entity);
        }

        public MultipleChoiceQuestion Read(string id)
        {
            return this.DbContext.MultipleChoiceQuestions.Where(q => q.QuestionId == id).SingleOrDefault();
        }

        public List<MultipleChoiceQuestion> ReadAll()
        {
            return this.DbContext.MultipleChoiceQuestions.ToList();
        }

        public void SaveChanges()
        {
            this.DbContext.SaveChanges();
        }
    }
}
