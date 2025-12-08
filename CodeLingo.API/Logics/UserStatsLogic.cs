using CodeLingo.API.Data;
using CodeLingo.API.Models;
using Microsoft.EntityFrameworkCore;
using static CodeLingo.API.DTOs.Stats.StatsDtos;
using static CodeLingo.API.Models.Enums;

namespace CodeLingo.API.Logics
{
    public class UserStatsLogic
    {
        private readonly AppDbContext _context;

        public UserStatsLogic(AppDbContext context)
        {
            _context = context;
        }

        public async Task<UserStatsDto> GetUserStatsAsync(string userId)
        {
            var progress = await _context.Progresses
                .FirstOrDefaultAsync(p => p.UserId == userId);

            if (progress == null)
            {
                progress = new Progress
                {
                    UserId = userId,
                    TotalScore = 0,
                    Xp = 0,
                    CurrentLevel = 1,
                    Streak = 0,
                    Accuracy = 0.0f,
                    LastSessionAt = null
                };

                _context.Progresses.Add(progress);
                await _context.SaveChangesAsync();
            }

            var sessions = await _context.Sessions
                .Include(s => s.SessionQuestions)
                .ThenInclude(sq => sq.Question)
                .Where(s => s.UserId == userId &&
                           (s.Status == SessionStatus.Completed || s.Status == SessionStatus.Terminated))
                .OrderBy(s => s.CreatedAt)
                .ToListAsync();

            var sessionCount = sessions.Count;

            // Calculate overall accuracy
            var allAnsweredQuestions = sessions.SelectMany(s => s.SessionQuestions.Where(sq => sq.Answered)).ToList();
            var correctCount = allAnsweredQuestions.Count(sq => sq.Correct);
            var totalAnswered = allAnsweredQuestions.Count;
            var accuracyPercentage = totalAnswered > 0 ? (float)correctCount / totalAnswered * 100 : 0f;

            // Build historical progress
            var historicalProgress = new HistoricalProgressDto
            {
                Sessions = sessions.Select(s =>
                {
                    var sessionAnswered = s.SessionQuestions.Count(sq => sq.Answered);
                    var sessionCorrect = s.SessionQuestions.Count(sq => sq.Correct);
                    var sessionAccuracy = sessionAnswered > 0 ? (float)sessionCorrect / sessionAnswered * 100 : 0f;
                    var sessionScore = s.SessionQuestions.Sum(sq => sq.PointsEarned);

                    return new HistoricalSessionDto
                    {
                        SessionId = s.Id,
                        Date = s.CreatedAt.ToString("yyyy-MM-ddTHH:mm:ssZ"),
                        Score = sessionScore,
                        Accuracy = sessionAccuracy,
                        Language = s.Language,
                        Difficulty = s.Difficulty.ToString().ToLower()
                    };
                }).ToArray()
            };

            // Language breakdown
            var languageGroups = sessions
                .GroupBy(s => s.Language)
                .Select(g =>
                {
                    var langSessions = g.ToList();
                    var langAnswered = langSessions.SelectMany(s => s.SessionQuestions.Where(sq => sq.Answered)).ToList();
                    var langCorrect = langAnswered.Count(sq => sq.Correct);
                    var langTotal = langAnswered.Count;
                    var langScore = langAnswered.Sum(sq => sq.PointsEarned);
                    var langAccuracy = langTotal > 0 ? (float)langCorrect / langTotal * 100 : 0f;

                    return new LanguageStatsDto
                    {
                        Language = g.Key,
                        TotalScore = langScore,
                        AccuracyPercentage = langAccuracy,
                        SessionCount = langSessions.Count
                    };
                }).ToArray();

            var languageBreakdown = new LanguageBreakdownDto
            {
                Items = languageGroups
            };

            // Difficulty breakdown
            var difficultyGroups = sessions
                .GroupBy(s => s.Difficulty)
                .Select(g =>
                {
                    var diffSessions = g.ToList();
                    var diffAnswered = diffSessions.SelectMany(s => s.SessionQuestions.Where(sq => sq.Answered)).ToList();
                    var diffCorrect = diffAnswered.Count(sq => sq.Correct);
                    var diffTotal = diffAnswered.Count;
                    var diffScore = diffAnswered.Sum(sq => sq.PointsEarned);
                    var diffAccuracy = diffTotal > 0 ? (float)diffCorrect / diffTotal * 100 : 0f;

                    return new DifficultyStatsDto
                    {
                        Difficulty = g.Key.ToString().ToLower(),
                        TotalScore = diffScore,
                        AccuracyPercentage = diffAccuracy,
                        SessionCount = diffSessions.Count
                    };
                }).ToArray();

            var difficultyBreakdown = new DifficultyBreakdownDto
            {
                Items = difficultyGroups
            };

            // Time-based stats
            var now = DateTime.UtcNow;
            var todayStart = now.Date;
            var weekStart = now.AddDays(-7);
            var monthStart = now.AddDays(-30);

            var dailyScore = sessions
                .Where(s => s.CreatedAt >= todayStart)
                .SelectMany(s => s.SessionQuestions)
                .Sum(sq => sq.PointsEarned);

            var weeklyScore = sessions
                .Where(s => s.CreatedAt >= weekStart)
                .SelectMany(s => s.SessionQuestions)
                .Sum(sq => sq.PointsEarned);

            var monthlyScore = sessions
                .Where(s => s.CreatedAt >= monthStart)
                .SelectMany(s => s.SessionQuestions)
                .Sum(sq => sq.PointsEarned);

            var timeBasedStats = new TimeBasedStatsDto
            {
                Daily = new TimeScoreDto { Score = dailyScore },
                Weekly = new TimeScoreDto { Score = weeklyScore },
                Monthly = new TimeScoreDto { Score = monthlyScore }
            };

            return new UserStatsDto
            {
                UserId = userId,
                TotalScore = progress.TotalScore,
                AccuracyPercentage = accuracyPercentage,
                SessionCount = sessionCount,
                HistoricalProgress = historicalProgress,
                LanguageBreakdown = languageBreakdown,
                DifficultyBreakdown = difficultyBreakdown,
                TimeBasedStats = timeBasedStats,
            };
        }
    }
}