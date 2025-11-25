using System.ComponentModel.DataAnnotations;

namespace CodeLingo.API.Models
{
    public class AuditLog
    {
        [Key]
        public string Id { get; set; } = Guid.NewGuid().ToString();

        [Required]
        public string UserId { get; set; }

        [Required]
        public string Action { get; set; } // Create, Update, Delete

        [Required]
        public string EntityType { get; set; } // Question, etc.

        [Required]
        public string EntityId { get; set; }

        public DateTime Timestamp { get; set; } = DateTime.UtcNow;

        public string? Details { get; set; } // JSON details
    }
}
