namespace CodeLingo.API.Models

{
    public enum HardnessLevel { Easy = 1, Medium = 2, Hard = 3 }
    public class Question
    {
        public int Id { get; set; }
        public int ProgrammingLanguageId { get; set; }
        public ProgrammingLanguage? ProgrammingLanguage { get; set; }
        public string QuestionText { get; set; } = null!;
        public string Option1 { get; set; } = null!;
        public string Option2 { get; set; } = null!;
        public string Option3 { get; set; } = null!;
        public string Option4 { get; set; } = null!;
        public int CorrectOptionNumber { get; set; }  // 1-4
        public HardnessLevel HardnessLevel { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
