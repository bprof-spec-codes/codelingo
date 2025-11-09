namespace CodeLingo.API.DTOs.Leaderboard
{
    public class LeaderboardDtos
    {
        public class LeaderboardDto
        {
            public int Page { get; set; }
            public int PageSize { get; set; }
            public int TotalEntries { get; set; }
            public int TotalPages { get; set; }
            public LeaderboardEntryDto[] Entries { get; set; }
            public CurrentUserContextDto CurrentUserContext { get; set; }
            public RankingRulesDto RankingRules { get; set; }
        }

        public class LeaderboardEntryDto
        {
            public string UserId { get; set; }
            public string Username { get; set; }
            public int Rank { get; set; }
            public int Score { get; set; }
            public float AccuracyPercentage { get; set; }
            public int SessionCount { get; set; }
            public string Language { get; set; }
            public string Difficulty { get; set; }
            public bool IsCurrentUser { get; set; }
        }

        public class CurrentUserContextDto
        {
            public int Rank { get; set; }
            public int Score { get; set; }
            public float AccuracyPercentage { get; set; }
            public int SessionCount { get; set; }
            public string Language { get; set; }
            public string Difficulty { get; set; }
        }

        public class RankingRulesDto
        {
            public string Primary { get; set; }
            public string Secondary { get; set; }
            public string TieBreak { get; set; }
        }
    }
}
