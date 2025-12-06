using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace CodeLingo.API.Models
{
    public class CodeCompletionQuestion
    {
        [Key]
        [ForeignKey("Question")]
        public string QuestionId { get; set; }

        [Column(TypeName = "text")]
        public string CodeSnippet { get; set; }

        [Column(TypeName = "text")]
        public string AcceptedAnswers { get; set; } // JSON array of strings

        // Navigation property
        public virtual Question Question { get; set; }
    }
}
