using CodeLingo.API.Models;
using System.Text.Json;
using CodeLingo.API.Repositories;
using static CodeLingo.API.DTOs.Session.SessionDtos;
using static CodeLingo.API.Models.Enums;

namespace CodeLingo.API.Logics
{
    public class SessionLogic
    {
        private ISessionRepository repository;
        private IQuestionRepository questionRepository;
        private SessionQuestionRepository sessionQuestionRepository;
        private IMultipleChoiceQuestionRepository multipleChoiceQuestionRepository;
        private IProgressRepository progressRepository;

        public SessionLogic(ISessionRepository repository, IQuestionRepository questionRepository, SessionQuestionRepository sessionQuestionRepository, IMultipleChoiceQuestionRepository multipleChoiceQuestionRepository, IProgressRepository progressRepository)
        {
                this.repository = repository;
                this.questionRepository = questionRepository;
                this.sessionQuestionRepository = sessionQuestionRepository;
                this.multipleChoiceQuestionRepository = multipleChoiceQuestionRepository;
                this.progressRepository = progressRepository;
        }

        public StartSessionResponseDto Create(StartSessionRequestDto session)
        {
            Session DatabaseSession = new Session();
            DatabaseSession.UserId = session.UserId;
            // Store selected languages as comma-separated string for backwards compatibility
            DatabaseSession.Language = string.Join(", ", session.LanguageIds);
            DatabaseSession.Difficulty = (DifficultyLevel)Enum.Parse(typeof(DifficultyLevel), session.Difficulty, true);
            DatabaseSession.DesiredCount = session.RequestedQuestionCount;

            repository.Create(DatabaseSession);

            List<Question> questions = this.questionRepository.getRandomQuestions(
                session.RequestedQuestionCount,
                session.LanguageIds,
                DatabaseSession.Difficulty
                );
            List<SessionQuestion> sessionQuestions = new List<SessionQuestion>();
            foreach (Question question in questions)
            {
                SessionQuestion sessionQuestion = new SessionQuestion();
                sessionQuestion.SessionId = DatabaseSession.Id;
                sessionQuestion.QuestionId = question.Id;
                sessionQuestionRepository.Create(sessionQuestion);
                sessionQuestions.Add(sessionQuestion);
            }

            DatabaseSession.SessionQuestions = sessionQuestions;
            repository.SaveChanges();

            StartSessionResponseDto startSessionResponseDto = new StartSessionResponseDto();
            startSessionResponseDto.SessionId = DatabaseSession.Id;
            startSessionResponseDto.TotalPlannedQuestions = DatabaseSession.DesiredCount;
            return startSessionResponseDto;
        }
        public void Update(Session session)
        {
            Session dataBaseSession = this.repository.Read(session.Id);
            dataBaseSession.Language = session.Language;
            dataBaseSession.Difficulty = session.Difficulty;
            dataBaseSession.DesiredCount = session.DesiredCount;
            dataBaseSession.Status = session.Status;
            dataBaseSession.CreatedAt = session.CreatedAt;
            dataBaseSession.UpdatedAt = DateTime.UtcNow;
        }
        public void Delete(Session session)
        {
            this.repository.Delete(session);
        }
        public Session Read(string id)
        {
            return repository.Read(id);
        }
        public List<Session> ReadAll() 
        { 
            return repository.ReadAll();
        }
        public bool IsValidSessionId(string sessionId)
        {
            return repository.ReadAll()
                .Select(s => s.Id)
                .ToList()
                .Contains(sessionId);
        }
        public NextQuestionResponseDto? GetNextQuestion(string sessionId)
        {
            var session = repository.Read(sessionId);
            if (session == null || session.Status != SessionStatus.Active)
                return null;

            var total = session.SessionQuestions.Count;
            var answered = session.SessionQuestions.Count(q => q.Answered);

            var next = session.SessionQuestions
                .Where(q => !q.Answered)
                .OrderBy(q => q.Question.CreatedAt)
                .FirstOrDefault();

            if (next == null)
            {
                repository.SaveChanges();

                return new NextQuestionResponseDto
                {
                    IsCompleted = true,
                    CurrentIndex = answered,
                    TotalQuestions = total
                };
            }

            object questionData = null;
            var tags = JsonSerializer.Deserialize<string[]>(next.Question.Tags ?? "[]");
            var metadata = JsonSerializer.Deserialize<object>(next.Question.Metadata ?? "{}");

            if (next.Question.Type == QuestionType.MultipleChoice)
            {
                var mcQuestion = multipleChoiceQuestionRepository.Read(next.QuestionId);
                if (mcQuestion != null)
                {
                    questionData = new
                    {
                        next.Question.Id,
                        Type = "MC",
                        next.Question.Title,
                        next.Question.QuestionText,
                        next.Question.Explanation,
                        next.Question.Language,
                        Difficulty = next.Question.Difficulty.ToString(),
                        Tags = tags,
                        Metadata = metadata,
                        Options = JsonSerializer.Deserialize<List<SessionQuestionOptionDto>>(mcQuestion.Options ?? "[]", new JsonSerializerOptions { PropertyNameCaseInsensitive = true }),
                        mcQuestion.AllowMultipleSelection,
                        mcQuestion.ShuffleOptions
                    };
                }
            }
            else if (next.Question.Type == QuestionType.CodeCompletion)
            {
                var fullQuestion = questionRepository.Read(next.QuestionId);
                if (fullQuestion?.CodeCompletionQuestion != null)
                {
                    questionData = new
                    {
                        next.Question.Id,
                        Type = "CodeCompletion",
                        next.Question.Title,
                        next.Question.QuestionText,
                        next.Question.Explanation,
                        next.Question.Language,
                        Difficulty = next.Question.Difficulty.ToString(),
                        Tags = tags,
                        Metadata = metadata,
                        CodeSnippet = fullQuestion.CodeCompletionQuestion.CodeSnippet
                    };
                }
            }
            
            if (questionData == null)
            {
                 questionData = new
                {
                    next.Question.Id,
                    next.Question.Title,
                    next.Question.QuestionText,
                    next.Question.Explanation,
                    next.Question.Language,
                    next.Question.Difficulty,
                    Tags = tags,
                    Metadata = metadata
                };
            }

            return new NextQuestionResponseDto
            {
                QuestionId = next.QuestionId,
                QuestionType = next.Question.Type.ToString(),
                QuestionData = questionData,
                CurrentIndex = answered,
                TotalQuestions = total,
                IsCompleted = false,
                Metadata = null
            };
        }

        public SessionSummaryDto CloseSession(string sessionId, string userId, bool forceClose)
        {
            var session = repository.ReadWithQuestions(sessionId);

            if (session == null)
            {
                throw new KeyNotFoundException("Session not found");
            }

            if (session.UserId != userId)
            {
                throw new UnauthorizedAccessException("Not authorized to close this session");
            }

            if (session.Status == SessionStatus.Completed || session.Status == SessionStatus.Terminated)
            {
                throw new InvalidOperationException("Session already closed or invalid state");
            }

            var totalQuestions = session.SessionQuestions.Count;
            var answeredQuestions = session.SessionQuestions.Count(sq => sq.Answered);
            var correctAnswers = session.SessionQuestions.Count(sq => sq.Correct);
            var totalScore = session.SessionQuestions.Sum(sq => sq.PointsEarned);
            var accuracyPercentage = answeredQuestions > 0
                ? (float)correctAnswers / answeredQuestions * 100
                : 0f;

            var unansweredQuestions = totalQuestions - answeredQuestions;
            if (unansweredQuestions > 0 && !forceClose)
            {
                throw new InvalidOperationException("Session already closed or invalid state");
            }

            session.Status = answeredQuestions == totalQuestions
                ? SessionStatus.Completed
                : SessionStatus.Terminated;
            session.UpdatedAt = DateTime.UtcNow;

            UpdateUserProgress(session.UserId, correctAnswers, totalScore, accuracyPercentage);

            repository.SaveChanges();

            return new SessionSummaryDto
            {
                SessionId = session.Id,
                UserId = session.UserId,
                Language = session.Language,
                Difficulty = session.Difficulty.ToString(),
                Status = session.Status.ToString().ToLower(),
                TotalQuestions = totalQuestions,
                AnsweredQuestions = answeredQuestions,
                CorrectAnswers = correctAnswers,
                TotalScore = totalScore,
                AccuracyPercentage = accuracyPercentage,
                ClosedAt = DateTime.UtcNow
            };
        }

        private void UpdateUserProgress(string userId, int correctAnswers, int totalScore, float accuracyPercentage)
        {
            var progress = progressRepository.ReadByUserId(userId);

            if (progress == null)
            {
                progress = new Progress
                {
                    UserId = userId,
                    TotalScore = totalScore,
                    Xp = totalScore,
                    CurrentLevel = 1,
                    Streak = correctAnswers,
                    Accuracy = accuracyPercentage / 100,
                    LastSessionAt = DateTime.UtcNow
                };
                progressRepository.Create(progress);
            }
            else
            {
                progress.TotalScore += totalScore;
                progress.Xp += totalScore;

                var completedSessions = repository.ReadAll()
                    .Where(s => s.UserId == userId &&
                               (s.Status == SessionStatus.Completed || s.Status == SessionStatus.Terminated))
                    .Count();

                progress.Accuracy = ((progress.Accuracy * (completedSessions - 1)) + (accuracyPercentage / 100)) / completedSessions;

                progress.CurrentLevel = CalculateLevelFromXp(progress.Xp);

                progress.LastSessionAt = DateTime.UtcNow;
            }

            progressRepository.SaveChanges();
        }

        /*
           Szintlépési képlet:
           Következő szint XP-minimum = előző szint XP-minimum + (aktuális szint × 100)
        */
        private int CalculateLevelFromXp(int xp)
        {
            int level = 1;
            int xpMinForCurrentLevel = 0;

            while (true)
            {
                int xpMinForNextLevel = xpMinForCurrentLevel + (level * 100);

                if (xp < xpMinForNextLevel)
                {
                    return level;
                }

                level++;
                xpMinForCurrentLevel = xpMinForNextLevel;
            }
        }

    }
}
