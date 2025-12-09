using CodeLingo.API.Data;
using CodeLingo.API.Models;
using Microsoft.EntityFrameworkCore;
using static CodeLingo.API.DTOs.Leaderboard.LeaderboardDtos;
using static CodeLingo.API.Models.Enums;

namespace CodeLingo.API.Logics
{
    public class LeaderboardLogic
    {
        private readonly AppDbContext _context;

        public LeaderboardLogic(AppDbContext context)
        {
            _context = context;
        }

        public async Task<LeaderboardDto> GetLeaderboardAsync(
            string currentUserId,
            string? language = null,
            string? difficulty = null,
            int page = 1,
            int pageSize = 20)
        {
            // Validate and constrain pageSize
            pageSize = Math.Min(Math.Max(1, pageSize), 100);
            page = Math.Max(1, page);

            // Parse difficulty if provided
            DifficultyLevel? difficultyLevel = null;
            if (!string.IsNullOrWhiteSpace(difficulty))
            {
                if (Enum.TryParse<DifficultyLevel>(difficulty, true, out var parsedDifficulty))
                {
                    difficultyLevel = parsedDifficulty;
                }
            }

            // Build base query - get all users with their progress and sessions
            var usersQuery = _context.Users
                .Include(u => u.Progress)
                .Include(u => u.Sessions)
                    .ThenInclude(s => s.SessionQuestions)
                .Where(u => u.IsActive && u.Progress != null)
                .AsQueryable();

            // Get all users for ranking calculations
            var allUsers = await usersQuery.ToListAsync();

            // Calculate stats for each user based on filters
            var userStats = allUsers.Select(user =>
            {
                var filteredSessions = user.Sessions
                    .Where(s => s.Status == SessionStatus.Completed || s.Status == SessionStatus.Terminated)
                    .AsEnumerable();

                // Apply language filter if specified
                if (!string.IsNullOrWhiteSpace(language))
                {
                    filteredSessions = filteredSessions.Where(s =>
                        s.Language.Split(',').Any(lang => lang.Trim().Equals(language, StringComparison.OrdinalIgnoreCase)));
                }

                // Apply difficulty filter if specified
                if (difficultyLevel.HasValue)
                {
                    filteredSessions = filteredSessions.Where(s => s.Difficulty == difficultyLevel.Value);
                }

                var sessions = filteredSessions.ToList();
                var allQuestions = sessions.SelectMany(s => s.SessionQuestions.Where(sq => sq.Answered)).ToList();

                var score = allQuestions.Sum(sq => sq.PointsEarned);
                var correctCount = allQuestions.Count(sq => sq.Correct);
                var totalCount = allQuestions.Count;
                var accuracy = totalCount > 0 ? (float)correctCount / totalCount * 100 : 0f;

                return new
                {
                    User = user,
                    Score = score,
                    Accuracy = accuracy,
                    SessionCount = sessions.Count
                };
            })
            .Where(x => x.SessionCount > 0) // Only include users who have completed sessions
            .OrderByDescending(x => x.Score)
            .ThenByDescending(x => x.Accuracy)
            .ThenBy(x => x.User.CreatedAt) // Tie-breaker: first to reach score
            .ToList();

            var totalEntries = userStats.Count;
            var totalPages = (int)Math.Ceiling(totalEntries / (double)pageSize);

            // Assign ranks by creating a new list
            var rankedUserStats = userStats.Select((stat, index) => new
            {
                stat.User,
                stat.Score,
                stat.Accuracy,
                stat.SessionCount,
                Rank = index + 1
            }).ToList();

            // Get paginated entries
            var paginatedStats = rankedUserStats
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToList();

            // Build leaderboard entries
            var entries = paginatedStats.Select(stat => new LeaderboardEntryDto
            {
                UserId = stat.User.Id,
                Username = stat.User.UserName ?? "Unknown",
                Rank = stat.Rank,
                Score = stat.Score,
                AccuracyPercentage = stat.Accuracy,
                SessionCount = stat.SessionCount,
                Language = language,
                Difficulty = difficulty?.ToLower(),
                IsCurrentUser = stat.User.Id == currentUserId
            }).ToArray();

            // Find current user context
            var currentUserStat = rankedUserStats.FirstOrDefault(x => x.User.Id == currentUserId);
            var currentUserContext = currentUserStat != null
                ? new CurrentUserContextDto
                {
                    Rank = currentUserStat.Rank,
                    Score = currentUserStat.Score,
                    AccuracyPercentage = currentUserStat.Accuracy,
                    SessionCount = currentUserStat.SessionCount,
                    Language = language,
                    Difficulty = difficulty?.ToLower()
                }
                : new CurrentUserContextDto
                {
                    Rank = 0,
                    Score = 0,
                    AccuracyPercentage = 0f,
                    SessionCount = 0,
                    Language = language,
                    Difficulty = difficulty?.ToLower()
                };

            var rankingRules = new RankingRulesDto
            {
                Primary = "score",
                Secondary = "accuracy",
                TieBreak = "first to reach score"
            };

            return new LeaderboardDto
            {
                Page = page,
                PageSize = pageSize,
                TotalEntries = totalEntries,
                TotalPages = totalPages,
                Entries = entries,
                CurrentUserContext = currentUserContext,
                RankingRules = rankingRules
            };
        }
    }
}