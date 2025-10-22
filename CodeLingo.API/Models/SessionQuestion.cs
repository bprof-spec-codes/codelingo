using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace CodeLingo.API.Models
{
    public class SessionQuestion
    {
        [Key]
        public string Id { get; set; } = Guid.NewGuid().ToString();

        [Required]
        [StringLength(36)]
        [ForeignKey("Session")]
        public string SessionId { get; set; }

        [Required]
        [StringLength(36)]
        [ForeignKey("Question")]
        public string QuestionId { get; set; }

        public bool Answered { get; set; } = false;
        public bool Correct { get; set; } = false;
        public int PointsEarned { get; set; } = 0;
        public DateTime? AnsweredAt { get; set; }

        // Navigation properties
        public virtual Session Session { get; set; }
        public virtual Question Question { get; set; }
    }
}
