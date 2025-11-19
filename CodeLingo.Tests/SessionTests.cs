using CodeLingo.API.Data;
using CodeLingo.API.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.ChangeTracking;
using Microsoft.Extensions.DependencyInjection;

namespace CodeLingo.Tests
{
    public class Tests
    {
        [SetUp]
        public void Setup()
        {
            var options = new DbContextOptionsBuilder<AppDbContext>()
            .UseInMemoryDatabase(databaseName: System.Guid.NewGuid().ToString())
            .Options;
            AppDbContext db = new AppDbContext(options);
            db.Database.EnsureDeleted();
            db.Database.EnsureCreated();
            this.SeedUsers(db);
            this.SeedQuestions(db);
        }
        [OneTimeTearDown]
        public void TearDown()
        {

        }
        [Test]
        public void SmokeTest()
        {
            Assert.Pass();
        }
        public void SeedUsers(AppDbContext appDbContext)
        {
            User user1 = new User();
            user1.Username = "test1";
            user1.PasswordHash = "test1";

            User user2 = new User();
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
            question1.Language = "test1";
            question1.Difficulty = Enums.DifficultyLevel.Medium;
            question1.Title = "test1";
            question1.QuestionText = "test1";
            question1.CreatedBy = "test-user";
            question1.Explanation = "test explanation";
            question1.Tags = "[]";
            question1.Metadata = "{}";

            Question question2 = new Question();
            question2.Type = Enums.QuestionType.MultipleChoice;
            question2.Language = "test2";
            question2.Difficulty = Enums.DifficultyLevel.Medium;
            question2.Title = "test2";
            question2.QuestionText = "test2";
            question2.CreatedBy = "test-user";
            question2.Explanation = "test explanation";
            question2.Tags = "[]";
            question2.Metadata = "{}";

            Question question3 = new Question();
            question3.Type = Enums.QuestionType.MultipleChoice;
            question3.Language = "test3";
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
    }
}