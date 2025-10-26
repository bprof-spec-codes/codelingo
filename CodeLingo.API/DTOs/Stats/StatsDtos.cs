namespace CodeLingo.API.DTOs.Stats
{
    public class StatsDtos
    {
        public class UserStatsDto
        {
            public string UserId { get; set; }
            public int TotalScore { get; set; }
            public float AccuracyPercentage { get; set; }
            public int SessionCount { get; set; }
            public HistoricalProgressDto HistoricalProgress { get; set; }
            public LanguageBreakdownDto LanguageBreakdown { get; set; }
            public DifficultyBreakdownDto DifficultyBreakdown { get; set; }
            public TimeBasedStatsDto TimeBasedStats { get; set; }
            public UserAchievementDto[] Achievements { get; set; }
        }

        public class HistoricalProgressDto
        {
            public HistoricalSessionDto[] Sessions { get; set; }
        }

        public class HistoricalSessionDto
        {
            public string SessionId { get; set; }
            public string Date { get; set; }
            public int Score { get; set; }
            public float Accuracy { get; set; }
            public object Language { get; set; }
            public string Difficulty { get; set; }
        }

        public class LanguageBreakdownDto
        {
            public LanguageStatsDto[] Items { get; set; }
        }

        public class LanguageStatsDto
        {
            public object Language { get; set; }
            public int TotalScore { get; set; }
            public float AccuracyPercentage { get; set; }
            public int SessionCount { get; set; }
        }

        public class DifficultyBreakdownDto
        {
            public DifficultyStatsDto[] Items { get; set; }
        }

        public class DifficultyStatsDto
        {
            public string Difficulty { get; set; }
            public int TotalScore { get; set; }
            public float AccuracyPercentage { get; set; }
            public int SessionCount { get; set; }
        }

        public class TimeBasedStatsDto
        {
            public TimeScoreDto Daily { get; set; }
            public TimeScoreDto Weekly { get; set; }
            public TimeScoreDto Monthly { get; set; }
        }

        public class TimeScoreDto
        {
            public int Score { get; set; }
        }

        public class UserAchievementDto
        {
            public string Name { get; set; }
            public bool Unlocked { get; set; }
            public string UnlockedAt { get; set; }
            public int Progress { get; set; }
            public string Description { get; set; }
        }
    }
}
