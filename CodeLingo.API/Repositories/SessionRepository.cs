using CodeLingo.API.Data;
using CodeLingo.API.Models;
using Microsoft.EntityFrameworkCore;

namespace CodeLingo.API.Repositories
{
    public class SessionRepository : ISessionRepository
    {
        private AppDbContext DbContext;
        public SessionRepository(AppDbContext dbContext)
        {
            this.DbContext = dbContext;
        }
        public void Create(Session entity)
        {
            this.DbContext.Sessions.Add(entity);
            this.DbContext.SaveChanges();
        }

        public void Delete(Session entity)
        {
            this.DbContext.Sessions.Remove(entity);
            this.DbContext.SaveChanges();
        }

        public List<Session> GetOutdatedSessions()
        {
            DateTime yestterday = DateTime.Now.AddHours(-24);
            return this.DbContext.Sessions.Where(s => s.Status == Enums.SessionStatus.Active && s.CreatedAt < yestterday).ToList();
        }

        public Session? Read(string id)
        {
            return this.DbContext.Sessions.Where(s => s.Id == id).SingleOrDefault();
        }

        public List<Session> ReadAll()
        {
            return this.DbContext.Sessions.ToList();
        }

        public async Task<int> CountSessionsAsync(DateTime? since = null)
        {
            var query = this.DbContext.Sessions.AsQueryable();
            if (since.HasValue)
            {
                query = query.Where(s => s.CreatedAt >= since.Value);
            }
            return await query.CountAsync();
        }

        public async Task<List<Session>> GetSessionsByUserId(string userId)
        {
            return await this.DbContext.Sessions
                .Include(s => s.SessionQuestions)
                .ThenInclude(sq => sq.Question)
                .Where(s => s.UserId == userId)
                .ToListAsync();
        }

        public void SaveChanges()
        {
            this.DbContext.SaveChanges();
        }

        public Session ReadWithQuestions(string id)
        {
            return DbContext.Sessions
                    .Include(s => s.SessionQuestions)
                        .ThenInclude(sq => sq.Question)
                    .FirstOrDefault(s => s.Id == id);
        }
    }
}
