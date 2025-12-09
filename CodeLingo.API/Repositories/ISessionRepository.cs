using CodeLingo.API.Models;

namespace CodeLingo.API.Repositories
{
    public interface ISessionRepository: IRepository<Session>
    {
        public List<Session> GetOutdatedSessions();
        Task<int> CountSessionsAsync(DateTime? since = null);
        Task<List<Session>> GetSessionsByUserId(string userId);
    }
}
