using CodeLingo.API.Data;
using CodeLingo.API.Models;
using Microsoft.EntityFrameworkCore.ChangeTracking;
using Microsoft.Extensions.DependencyInjection;

namespace CodeLingo.Tests
{
    public class Tests
    {
        protected readonly HttpClient Client;
        protected readonly CustomWebApplicationFactory Factory;

        public Tests()
        {
            Factory = new CustomWebApplicationFactory();
            Client = Factory.CreateClient();
        }

        [SetUp]
        public void Setup()
        {
            using var scope = Factory.Services.CreateScope();
            AppDbContext db = scope.ServiceProvider.GetService<AppDbContext>();
            db.Database.EnsureDeleted();
            db.Database.EnsureCreated();
            this.SeedUsers(db);
            
        }
        [OneTimeTearDown]
        public void tearDown()
        {
            Client.Dispose();
            Factory.Dispose();
        }
        [Test]
        public void Test1()
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
    }
}