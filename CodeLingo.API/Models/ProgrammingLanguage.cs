namespace CodeLingo.API.Models
{
    public class ProgrammingLanguage
    {
        public int Id { get; set; }
        public string Name { get; set; } = null!;
        public string ShortCode { get; set; } = null!;
        public virtual ICollection<Question> Questions { get; set; } = new List<Question>();
    }
}
