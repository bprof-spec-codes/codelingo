// Tests/CustomWebApplicationFactory.cs
using CodeLingo.API.Data;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.VisualStudio.TestPlatform.TestHost;
using NUnit.Framework.Interfaces;

namespace CodeLingo.Tests
{
    public class CustomWebApplicationFactory : WebApplicationFactory<Program>
    {
        protected override IHost CreateHost(IHostBuilder builder)
        {
            builder.ConfigureServices(services =>
            {
                // Remove the real DbContext registration
                var descriptor = services.SingleOrDefault(
                    d => d.ServiceType == typeof(DbContextOptions<AppDbContext>));
                if (descriptor != null) services.Remove(descriptor);

                // Add InMemory DB (fast) or SQLite in-memory (more realistic)
                services.AddDbContext<AppDbContext>(options =>
                {
                    //Pure InMemory (fastest, but no relational features)
                     options.UseInMemoryDatabase("TestDb_" + Guid.NewGuid());
                    
                });

                // Ensure database is created and seeded per test run
                using var scope = services.BuildServiceProvider().CreateScope();
                var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
                db.Database.EnsureCreated(); // Creates schema
                                             
            });

            return base.CreateHost(builder);
        }
    }
}