using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace CodeLingo.API.Models
{
    public class MultipleChoiceQuestion
    {
        [Key]
        [ForeignKey("Question")]
        public string QuestionId { get; set; }

        [Required]
        [Column(TypeName = "nvarchar(max)")]
        public string Options { get; set; } // JSON array of AnswerOption

        [Required]
        [Column(TypeName = "nvarchar(max)")]
        public string CorrectAnswerIds { get; set; } // JSON array of strings

        public bool AllowMultipleSelection { get; set; } = false;
        public bool ShuffleOptions { get; set; } = true;

        // Navigation property
        public virtual Question Question { get; set; }
    }
}

