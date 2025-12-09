using static CodeLingo.API.Models.Enums;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace CodeLingo.API.Models
{
    public class Session
    {
        [Key]
        public string Id { get; set; } = Guid.NewGuid().ToString();

        [Required]
        [StringLength(450)]
        [ForeignKey("User")]
        public string UserId { get; set; }

        [Required]
        [StringLength(20)]
        public string Language { get; set; }

        [Required]
        public DifficultyLevel Difficulty { get; set; }

        [Required]
        public int DesiredCount { get; set; }

        [Required]
        [StringLength(20)]
        public SessionStatus Status { get; set; } = SessionStatus.Active;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

        // Navigation properties
        public virtual User User { get; set; }
        public virtual ICollection<SessionQuestion> SessionQuestions { get; set; }
    }
}
