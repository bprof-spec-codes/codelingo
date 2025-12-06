using CodeLingo.API.Data;
using CodeLingo.API.Models;

namespace CodeLingo.API.Repositories
{
    public interface IAuditLogRepository : IRepository<AuditLog>
    {
        Task LogAsync(string userId, string action, string entityType, string entityId, string? details = null);
    }

    public class AuditLogRepository : IAuditLogRepository
    {
        private readonly AppDbContext _context;

        public AuditLogRepository(AppDbContext context)
        {
            _context = context;
        }

        public void Create(AuditLog entity)
        {
            _context.AuditLogs.Add(entity);
        }

        public void Delete(AuditLog entity)
        {
            _context.AuditLogs.Remove(entity);
        }

        public AuditLog? Read(string id)
        {
            return _context.AuditLogs.FirstOrDefault(l => l.Id == id);
        }

        public List<AuditLog> ReadAll()
        {
            return _context.AuditLogs.ToList();
        }

        public void SaveChanges()
        {
            _context.SaveChanges();
        }

        public async Task LogAsync(string userId, string action, string entityType, string entityId, string? details = null)
        {
            var log = new AuditLog
            {
                UserId = userId,
                Action = action,
                EntityType = entityType,
                EntityId = entityId,
                Details = details,
                Timestamp = DateTime.UtcNow
            };
            _context.AuditLogs.Add(log);
            await _context.SaveChangesAsync();
        }
    }
}
