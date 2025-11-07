namespace CodeLingo.API.Repositories
{
    public interface IRepository<T>
    {
        public void Create(T entity);
        public void SaveChanges();
        public void Delete(T entity);
        public T Read(string id);
        public List<T> ReadAll();

    }
}
