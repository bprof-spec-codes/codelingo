using CodeLingo.API.Models;
using CodeLingo.API.Repositories;

namespace CodeLingo.API.Logics
{
    public class SessionLogic
    {
        private ISessionRepository repository;
        public SessionLogic(ISessionRepository repository)
        {
                this.repository = repository;
        }
        
        public void Create(Session session)
        {
            repository.Create(session);
        }
       
    }
}
