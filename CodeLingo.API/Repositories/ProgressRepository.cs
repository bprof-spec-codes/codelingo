using CodeLingo.API.Data;
using CodeLingo.API.Models;
using Microsoft.EntityFrameworkCore;

namespace CodeLingo.API.Repositories
{
    public class ProgressRepository : IProgressRepository
    {
        private readonly AppDbContext _ctx;

        public ProgressRepository(AppDbContext ctx)
        {
            _ctx = ctx;
        }

        public void Create(Progress entity)
        {
            _ctx.Progresses.Add(entity);
        }

        public void Delete(Progress entity)
        {
            _ctx.Progresses.Remove(entity);
        }

        public Progress Read(string id)
        {
            return _ctx.Progresses
                .Include(p => p.User)
                .FirstOrDefault(p => p.UserId == id);
        }

        public Progress ReadByUserId(string userId)
        {
            return _ctx.Progresses
                .Include(p => p.User)
                .FirstOrDefault(p => p.UserId == userId);
        }

        public List<Progress> ReadAll()
        {
            return _ctx.Progresses
                .Include(p => p.User)
                .ToList();
        }

        public void SaveChanges()
        {
            _ctx.SaveChanges();
        }
    }
}
