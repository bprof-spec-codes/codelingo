using System.ComponentModel.DataAnnotations;

namespace CodeLingo.API.DTOs.Session
{
    public class SessionDtos
    {
        public class StartSessionRequestDto
        {
            public string? UserId { get; set; }

            [Required]
            [MinLength(1, ErrorMessage = "At least one language must be selected")]
            public List<string> LanguageIds { get; set; }

            [Required]
            public string Difficulty { get; set; }

            [Required]
            [Range(1, 100)]
            public int RequestedQuestionCount { get; set; }
        }

        public class StartSessionResponseDto
        {
            public string SessionId { get; set; }
            public int TotalPlannedQuestions { get; set; }
        }

        public class NextQuestionResponseDto
        {
            public string QuestionId { get; set; }
            public string QuestionType { get; set; }
            public object QuestionData { get; set; }
            public int CurrentIndex { get; set; }
            public int TotalQuestions { get; set; }
            public bool IsCompleted { get; set; }
            public object Metadata { get; set; }
        }

        public class SessionQuestionOptionDto
        {
            public string Id { get; set; }
            public string Text { get; set; }
            public string? ImageUrl { get; set; }
            public int Order { get; set; }
        }

        public class SubmitAnswerRequestDto
        {
            public string RequestId { get; set; }
            public object AnswerPayload { get; set; }
        }

        public class SubmitAnswerResponseDto
        {
            public bool IsCorrect { get; set; }
            public string Feedback { get; set; }
            public int Score { get; set; }
            public int CurrentIndex { get; set; }
            public int TotalQuestions { get; set; }
            public bool IsCompleted { get; set; }
        }

        public class CloseSessionRequestDto
        {
            public bool ForceClose { get; set; } = false;
        }

        public class SessionSummaryDto
        {
            public string SessionId { get; set; }
            public string UserId { get; set; }
            public string Language { get; set; }
            public string Difficulty { get; set; }
            public string Status { get; set; }
            public int TotalQuestions { get; set; }
            public int AnsweredQuestions { get; set; }
            public int CorrectAnswers { get; set; }
            public int TotalScore { get; set; }
            public float AccuracyPercentage { get; set; }
            public DateTime ClosedAt { get; set; }
        }

        public class SessionResultsDto
        {
            public string SessionId { get; set; }
            public string UserId { get; set; }
            public string LanguageId { get; set; }
            public string Difficulty { get; set; }
            public int TotalQuestions { get; set; }
            public int AnsweredQuestions { get; set; }
            public int CorrectAnswers { get; set; }
            public int TotalScore { get; set; }
            public float AccuracyPercentage { get; set; }
            public DateTime CreatedAt { get; set; }
            public QuestionResultDto[] Questions { get; set; }
            public PerformanceDto Performance { get; set; }
            public AchievementUnlockedDto[] AchievementsUnlocked { get; set; }
        }

        public class QuestionResultDto
        {
            public string QuestionId { get; set; }
            public string Type { get; set; }
            public string Title { get; set; }
            public string QuestionText { get; set; }
            public string Explanation { get; set; }
            public string[] Tags { get; set; }
            public bool Answered { get; set; }
            public bool Correct { get; set; }
            public int PointsEarned { get; set; }
        }

        public class PerformanceDto
        {
            public int StreakMax { get; set; }
            public int StreakCurrent { get; set; }
            public BreakdownDto Breakdown { get; set; }
        }

        public class BreakdownDto
        {
            public object ByLanguage { get; set; }
            public object ByDifficulty { get; set; }
        }

        public class AchievementUnlockedDto
        {
            public string AchievementId { get; set; }
            public string Name { get; set; }
            public string Description { get; set; }
            public DateTime UnlockedAt { get; set; }
        }
    }
}
