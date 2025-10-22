namespace CodeLingo.API.Models
{
    public class Enums
    {
        public enum QuestionType
        {
            MultipleChoice,
            CodeCompletion,
            TrueFalse,
            FillInBlank,
            CodeReview
        }

        public enum DifficultyLevel
        {
            Easy,
            Medium,
            Hard
        }

        public enum SessionStatus
        {
            Active,
            Completed,
            Terminated
        }
    }
}
