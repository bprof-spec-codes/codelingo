namespace CodeLingo.API.Repositories
{
    public interface IRepository<T>
    {
        public void Create(T entity);
    }
}
