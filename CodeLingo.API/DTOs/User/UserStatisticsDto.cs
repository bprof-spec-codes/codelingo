namespace CodeLingo.API.DTOs.User
{
    public class UserStatisticsDto
    {
        public int TotalQuestionsAnswered { get; set; }
        public double Accuracy { get; set; }
        public int CurrentStreak { get; set; }
        public int Rank { get; set; }
    }
}
