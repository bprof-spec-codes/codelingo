using CodeLingo.API.Data;
using CodeLingo.API.Models;
using Microsoft.EntityFrameworkCore;

namespace CodeLingo.API
{
    public class Program
    {
        public static async Task Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            // Add services to the container.

            // EF Core + ConnectionString
            var cs = builder.Configuration.GetConnectionString("DefaultConnection");
            builder.Services.AddDbContext<AppDbContext>(opt => opt.UseSqlServer(cs));

            builder.Services.AddControllers();
            // Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
            builder.Services.AddEndpointsApiExplorer();
            builder.Services.AddSwaggerGen();

            // CORS
            var allowedOrigins = builder.Configuration["AllowedOrigins"]?.Split(',', StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries) ?? [];
            builder.Services.AddCors(options =>
            {
                options.AddDefaultPolicy(policy =>
                    policy.WithOrigins(allowedOrigins)
                          .AllowAnyHeader()
                          .AllowAnyMethod());
            });

            var app = builder.Build();

            // Apply migrations + seed on startup
            using (var scope = app.Services.CreateScope())
            {
                var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
                await db.Database.MigrateAsync(); // létrehozza/napra készíti a sémát [web:129]

                // Seed only if empty
                if (!await db.ProgrammingLanguages.AnyAsync() && !await db.Questions.AnyAsync()) // példa feltétel [web:122]
                {
                    var csharp = new ProgrammingLanguage { Name = "C#", ShortCode = "csharp" };
                    var js = new ProgrammingLanguage { Name = "JavaScript", ShortCode = "js" };
                    var py = new ProgrammingLanguage { Name = "Python", ShortCode = "py" };
                    db.ProgrammingLanguages.AddRange(csharp, js, py);

                    db.Questions.AddRange(
                        new Question
                        {
                            ProgrammingLanguage = csharp,
                            QuestionText = "Mi a kimenet? Console.WriteLine(5 + 3);",
                            Option1 = "5",
                            Option2 = "8",
                            Option3 = "53",
                            Option4 = "Fordítási hiba",
                            CorrectOptionNumber = 2,
                            HardnessLevel = HardnessLevel.Easy
                        },
                        new Question
                        {
                            ProgrammingLanguage = js,
                            QuestionText = "Mi a typeof null JavaScriptben?",
                            Option1 = "null",
                            Option2 = "object",
                            Option3 = "undefined",
                            Option4 = "number",
                            CorrectOptionNumber = 2,
                            HardnessLevel = HardnessLevel.Medium
                        },
                        new Question
                        {
                            ProgrammingLanguage = py,
                            QuestionText = "Mi a kimenet? print('3' * 2)",
                            Option1 = "6",
                            Option2 = "33",
                            Option3 = "Hiba",
                            Option4 = "None",
                            CorrectOptionNumber = 2,
                            HardnessLevel = HardnessLevel.Easy
                        }
                    );

                    await db.SaveChangesAsync();
                }
            }

            // Configure the HTTP request pipeline.
            if (app.Environment.IsDevelopment())
            {
                app.UseSwagger();
                app.UseSwaggerUI();
            }

            app.UseHttpsRedirection();
            app.UseCors();
            app.UseAuthorization();


            app.MapControllers();

            app.Run();
        }
    }
}
