using CodeLingo.API.Data;
using CodeLingo.API.Logics;
using CodeLingo.API.Models;
using CodeLingo.API.Repositories;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Diagnostics;
using static CodeLingo.API.DTOs.Session.SessionDtos;

namespace CodeLingo.Tests
{
    public class SessionTests
    {
        private AppDbContext db;
        private ISessionRepository sessionRepository;
        private QuestionRepository questionRepository;
        private SessionQuestionRepository sessionQuestionRepository;
        private SessionLogic underTest;

        [SetUp]
        public void Setup()
        {
            var options = new DbContextOptionsBuilder<AppDbContext>()
            .UseInMemoryDatabase(databaseName: System.Guid.NewGuid().ToString())
            .ConfigureWarnings(warnings => warnings.Ignore(InMemoryEventId.TransactionIgnoredWarning))
            .Options;
            this.db = new AppDbContext(options);
            db.Database.EnsureDeleted();
            db.Database.EnsureCreated();
            this.SeedUsers(db);
            this.SeedQuestions(db);
            sessionRepository = new SessionRepository(db);
            questionRepository = new QuestionRepository(db);
            sessionQuestionRepository = new SessionQuestionRepository(db);
            underTest = new SessionLogic(sessionRepository, questionRepository, sessionQuestionRepository);
        }

        [TearDown]
        public void TearDown()
        {
            db.Dispose();
        }
        public void SeedUsers(AppDbContext appDbContext)
        {
            User user1 = new User();
            user1.Id = "test1ID";
            user1.Username = "test1";
            user1.PasswordHash = "test1";

            User user2 = new User();
            user2.Id = "test2ID";
            user2.Username = "test2";
            user2.PasswordHash = "test2";
            appDbContext.Users.Add(user1);
            appDbContext.Users.Add(user2);
            appDbContext.SaveChanges();
        }
        public void SeedQuestions(AppDbContext appDbContext)
        {
            Question question1 = new Question();
            question1.Type = Enums.QuestionType.MultipleChoice;
            question1.Language = "test1Language";
            question1.Difficulty = Enums.DifficultyLevel.Medium;
            question1.Title = "test1";
            question1.QuestionText = "test1";
            question1.CreatedBy = "test-user";
            question1.Explanation = "test explanation";
            question1.Tags = "[]";
            question1.Metadata = "{}";

            Question question2 = new Question();
            question2.Type = Enums.QuestionType.MultipleChoice;
            question2.Language = "test1Language";
            question2.Difficulty = Enums.DifficultyLevel.Medium;
            question2.Title = "test2";
            question2.QuestionText = "test2";
            question2.CreatedBy = "test-user";
            question2.Explanation = "test explanation";
            question2.Tags = "[]";
            question2.Metadata = "{}";

            Question question3 = new Question();
            question3.Type = Enums.QuestionType.MultipleChoice;
            question3.Language = "test1Language";
            question3.Difficulty = Enums.DifficultyLevel.Medium;
            question3.Title = "test3";
            question3.QuestionText = "test3";
            question3.CreatedBy = "test-user";
            question3.Explanation = "test explanation";
            question3.Tags = "[]";
            question3.Metadata = "{}";

            appDbContext.Questions.Add(question1);
            appDbContext.Questions.Add(question2);
            appDbContext.Questions.Add(question3);
            appDbContext.SaveChanges();
        }

        [Test]
        public void SmokeTest()
        {
            Assert.Pass();
        }

        [Test]
        public void TestCreate_ValidObject_CreationSuccessful()
        {
            // Arrange
            StartSessionRequestDto sessionRequest = new StartSessionRequestDto();
            sessionRequest.UserId = "test1ID";
            sessionRequest.Difficulty = "Medium";
            sessionRequest.Language = "test1Language";
            sessionRequest.RequestedQuestionCount = 1;

            // Act
            StartSessionResponseDto responseDto = underTest.Create(sessionRequest);
            
            // Assert
            Assert.AreEqual(1, responseDto.TotalPlannedQuestions);
            Assert.IsNotEmpty(responseDto.SessionId);
        }

        [Test]
        public void TestCreate_ValidObject_CreatedSessionQuestionObjects()
        {
            // Arrange
            StartSessionRequestDto sessionRequest = new StartSessionRequestDto();
            sessionRequest.UserId = "test1ID";
            sessionRequest.Difficulty = "Medium";
            sessionRequest.Language = "test1Language";
            sessionRequest.RequestedQuestionCount = 2;

            // Act
            StartSessionResponseDto responseDto = underTest.Create(sessionRequest);
            List<SessionQuestion> questions = sessionQuestionRepository.GetAll();

            // Assert
            Assert.AreEqual(2, questions.Count);
            
        }

        [Test]
        public void TestReadAll_ExistsObjectInDb_ShouldReturnObjects()
        {
            // Arrange
            StartSessionRequestDto sessionRequest = new StartSessionRequestDto();
            sessionRequest.UserId = "test1ID";
            sessionRequest.Difficulty = "Medium";
            sessionRequest.Language = "test1Language";
            sessionRequest.RequestedQuestionCount = 2;

            // Act
            StartSessionResponseDto responseDto = underTest.Create(sessionRequest);
           List<Session> sessions = sessionRepository.ReadAll();

            // Assert
            Assert.AreEqual(1, sessions.Count);
            Assert.AreEqual("test1ID", sessions[0].UserId);
            Assert.AreEqual(Enums.DifficultyLevel.Medium, sessions[0].Difficulty);
            Assert.AreEqual("test1Language", sessions[0].Language);

        }
    }
}