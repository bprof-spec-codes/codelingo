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

        public SessionLogic(ISessionRepository repository, IQuestionRepository questionRepository, SessionQuestionRepository sessionQuestionRepository, IMultipleChoiceQuestionRepository multipleChoiceQuestionRepository)
        {
                this.repository = repository;
                this.questionRepository = questionRepository;
                this.sessionQuestionRepository = sessionQuestionRepository;
                this.multipleChoiceQuestionRepository = multipleChoiceQuestionRepository;
        }

        public StartSessionResponseDto Create(StartSessionRequestDto session)
        {
            Session DatabaseSession = new Session();
            DatabaseSession.UserId = session.UserId;
            DatabaseSession.Language = session.Language;
            DatabaseSession.Difficulty = (DifficultyLevel)Enum.Parse(typeof(DifficultyLevel), session.Difficulty, true);
            DatabaseSession.DesiredCount = session.RequestedQuestionCount;

            repository.Create(DatabaseSession);

            List<Question> questions = this.questionRepository.getRandomQuestions(
                session.RequestedQuestionCount,
                session.Language,
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
                session.Status = SessionStatus.Completed;
                session.UpdatedAt = DateTime.UtcNow;
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
                        Difficulty = next.Question.Difficulty.ToString().ToLower(),
                        Tags = tags,
                        Metadata = metadata,
                        Options = JsonSerializer.Deserialize<List<SessionQuestionOptionDto>>(mcQuestion.Options ?? "[]", new JsonSerializerOptions { PropertyNameCaseInsensitive = true }),
                        mcQuestion.AllowMultipleSelection,
                        mcQuestion.ShuffleOptions
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
       
    }
}
