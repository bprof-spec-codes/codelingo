using CodeLingo.API.Data;
using CodeLingo.API.Models;

namespace CodeLingo.API.Repositories
{
    public class SessionQuestionRepository
    {
        private AppDbContext appDbContext;
        public SessionQuestionRepository(AppDbContext appDbContext)
        {
            this.appDbContext = appDbContext;
        }
        public void Create(SessionQuestion sessionQuestion)
        {
            this.appDbContext.SessionQuestions.Add(sessionQuestion);
        }
        public SessionQuestion? Read(string sessionId, string questionId)
        {
            return appDbContext.SessionQuestions.FirstOrDefault(sq => sq.SessionId == sessionId && sq.QuestionId == questionId);
        }
        public void SaveChanges()
        {
            appDbContext.SaveChanges();
        }
    }
}
