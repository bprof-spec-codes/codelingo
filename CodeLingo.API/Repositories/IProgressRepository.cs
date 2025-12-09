using CodeLingo.API.Models;

namespace CodeLingo.API.Repositories
{
    public interface IProgressRepository : IRepository<Progress>
    {
        Progress ReadByUserId(string userId);
    }
}
