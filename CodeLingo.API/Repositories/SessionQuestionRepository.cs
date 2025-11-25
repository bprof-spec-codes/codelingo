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
        public List<SessionQuestion> GetAll()
        {
            return this.appDbContext.SessionQuestions.ToList();
        }
    }
}
