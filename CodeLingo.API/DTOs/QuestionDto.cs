namespace CodeLingo.API.DTOs
{
    public class QuestionDto
    {
        public int Id { get; set; }
        public int ProgrammingLanguageId { get; set; }
        public string ProgrammingLanguageName { get; set; } = null!;
        public string QuestionText { get; set; } = null!;
        public string Option1 { get; set; } = null!;
        public string Option2 { get; set; } = null!;
        public string Option3 { get; set; } = null!;
        public string Option4 { get; set; } = null!;
        public int HardnessLevel { get; set; }  // 1=Easy,2=Medium,3=Hard
        public string HardnessLevelText { get; set; } = null!;
    }
}
