using CodeLingo.API.Models;
using CodeLingo.API.Repositories;
using static CodeLingo.API.DTOs.Session.SessionDtos;
using static CodeLingo.API.Models.Enums;

namespace CodeLingo.API.Logics
{
    public class SessionLogic
    {
        private ISessionRepository repository;
        public SessionLogic(ISessionRepository repository)
        {
                this.repository = repository;
        }
        
        public void Create(StartSessionRequestDto session)
        {
            Session DatabaseSession = new Session();
            DatabaseSession.UserId = session.UserId;
            DatabaseSession.Language = session.Language;
            DatabaseSession.Difficulty = (DifficultyLevel)Enum.Parse(typeof(DifficultyLevel),session.Difficulty);
            DatabaseSession.DesiredCount = session.RequestedQuestionCount;
            repository.Create(DatabaseSession);
        }
        public void Update(Session session)
        {
            Session dataBaseSession = this.repository.Read(session.Id);
            dataBaseSession.Language = session.Language;
            dataBaseSession.Difficulty = session.Difficulty;
            dataBaseSession.DesiredCount = session.DesiredCount;
            dataBaseSession.Status = session.Status;
            dataBaseSession.CreatedAt = session.CreatedAt;
            dataBaseSession.UpdatedAt = DateTime.UtcNow;
        }
        public void Delete(Session session)
        {
            this.repository.Delete(session);
        }
        public Session Read(string id)
        {
            return repository.Read(id);
        }
        public List<Session> ReadAll() 
        { 
            return repository.ReadAll();
        }
       
    }
}
