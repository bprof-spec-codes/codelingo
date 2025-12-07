using static CodeLingo.API.Models.Enums;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace CodeLingo.API.Models

{
    public class Question
    {
        [Key]
        public string Id { get; set; } = Guid.NewGuid().ToString();

        [Required]
        public QuestionType Type { get; set; }

        [Required]
        [StringLength(20)]
        public string Language { get; set; }

        [Required]
        public DifficultyLevel Difficulty { get; set; }

        [Required]
        [StringLength(255)]
        public string Title { get; set; }

        [Required]
        [Column(TypeName = "text")]
        public string QuestionText { get; set; }

        [Column(TypeName = "text")]
        public string Explanation { get; set; }

        [Column(TypeName = "json")]
        public string Tags { get; set; } // JSON array of strings

        [Column(TypeName = "json")]
        public string Metadata { get; set; } // JSON object

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

        [Required]
        [StringLength(36)]
        public string CreatedBy { get; set; }

        public bool IsActive { get; set; } = true;

        // Navigation properties
        public virtual ICollection<SessionQuestion> SessionQuestions { get; set; }
        public virtual MultipleChoiceQuestion? MultipleChoiceQuestion { get; set; }
        public virtual CodeCompletionQuestion? CodeCompletionQuestion { get; set; }
    }
}
