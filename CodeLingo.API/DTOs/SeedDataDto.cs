using static CodeLingo.API.Models.Enums;

namespace CodeLingo.API.DTOs
{
    public class SeedDataDto
    {
        public QuestionType Type { get; set; }
        public string Language { get; set; }
        public DifficultyLevel Difficulty { get; set; }
        public string Title { get; set; }
        public string QuestionText { get; set; }
        public string Explanation { get; set; }
        public List<string> Tags { get; set; }
        public object Metadata { get; set; }

        // Multiple Choice specific
        public List<object> Options { get; set; }
        public List<string> CorrectAnswerIds { get; set; }
        public bool AllowMultipleSelection { get; set; }
        public bool ShuffleOptions { get; set; }
        
        // Code Completion specific
        // Code Completion specific
        public string CodeSnippet { get; set; }
        public List<string> AcceptedAnswers { get; set; }
    }
}
