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
            this.DbContext.Add(entity);
        }
    }
}
