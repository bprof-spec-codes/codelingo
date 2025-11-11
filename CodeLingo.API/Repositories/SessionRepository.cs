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
        }

        public void Delete(Session entity)
        {
            this.DbContext.Sessions.Remove(entity);
        }

        public Session Read(string id)
        {
            return this.DbContext.Sessions.Where(s => s.Id == id).SingleOrDefault();
        }

        public List<Session> ReadAll()
        {
            return this.DbContext.Sessions.ToList();
        }

        public void SaveChanges()
        {
            this.DbContext.SaveChanges();
        }
    }
}
