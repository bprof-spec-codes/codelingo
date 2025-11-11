using CodeLingo.API.Data;
using CodeLingo.API.Models;
using Microsoft.EntityFrameworkCore;
using static CodeLingo.API.Models.Enums;
using System.Text.Json;
using CodeLingo.API.Repositories;
using CodeLingo.API.Logics;

namespace CodeLingo.API
{
    public class Program
    {
        public static async Task Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            // Add services to the container.

            // EF Core + ConnectionString
            //var cs = builder.Configuration.GetConnectionString("DefaultConnection");
            builder.Services.AddDbContext<AppDbContext>(opt => opt.UseInMemoryDatabase("CodeLingoTestDb").UseLazyLoadingProxies());
            builder.Services.AddScoped<ISessionRepository, SessionRepository>();
            builder.Services.AddScoped<SessionQuestionRepository>();
            builder.Services.AddScoped<QuestionRepository>();
            builder.Services.AddScoped<SessionLogic>();
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
                //await db.Database.MigrateAsync(); // létrehozza/napra készíti a sémát [web:129] inmemory miatt kikommentezve

                // Seed only if empty
                if (!await db.ProgrammingLanguages.AnyAsync() && !await db.Questions.AnyAsync())
                {
                    var csharp = new ProgrammingLanguage { Name = "C#", ShortCode = "csharp" };
                    var js = new ProgrammingLanguage { Name = "JavaScript", ShortCode = "js" };
                    var py = new ProgrammingLanguage { Name = "Python", ShortCode = "py" };
                    db.ProgrammingLanguages.AddRange(csharp, js, py);

                    // Define a helper method for creating the JSON options structure
                    string CreateOptionsJson(string opt1, string opt2, string opt3, string opt4)
                    {
                        // Using a simple array of objects for the options structure
                        var options = new[]
                        {
            new { id = "1", text = opt1 },
            new { id = "2", text = opt2 },
            new { id = "3", text = opt3 },
            new { id = "4", text = opt4 }
        };
                        return JsonSerializer.Serialize(options);
                    }

                    // --- C# Question Setup ---
                    var csharpQuestion = new Question
                    {
                        Type = QuestionType.MultipleChoice,
                        Language = csharp.ShortCode,
                        Difficulty = DifficultyLevel.Easy,
                        Title = "C# Console Output",
                        QuestionText = "Mi a kimenet? Console.WriteLine(5 + 3);",
                        CreatedBy = "SeederUser1",

                        // JAVÍTÁS: Kötelező mezők hozzáadása
                        Explanation = "A C# programban a `Console.WriteLine(5 + 3);` a két egész szám összegét írja ki: 8.",
                        Tags = "[\"csharp\", \"basic\", \"console-output\"]", // JSON array
                        Metadata = "{}" // Üres JSON object
                    };

                    var csharpMCQ = new MultipleChoiceQuestion
                    {
                        Question = csharpQuestion,
                        Options = CreateOptionsJson("5", "8", "53", "Fordítási hiba"),
                        CorrectAnswerIds = JsonSerializer.Serialize(new[] { "2" }) // The correct option ID is "2"
                    };

                    // --- JavaScript Question Setup ---
                    var jsQuestion = new Question
                    {
                        Type = QuestionType.MultipleChoice,
                        Language = js.ShortCode,
                        Difficulty = DifficultyLevel.Medium,
                        Title = "JavaScript typeof null",
                        QuestionText = "Mi a typeof null JavaScriptben?",
                        CreatedBy = "SeederUser1",

                        // JAVÍTÁS: Kötelező mezők hozzáadása
                        Explanation = "A 'typeof null' egy történelmi hiba miatt ad vissza 'object'-et, nem pedig 'null'-t.",
                        Tags = "[\"javascript\", \"types\", \"quirks\"]",
                        Metadata = "{}"
                    };

                    var jsMCQ = new MultipleChoiceQuestion
                    {
                        Question = jsQuestion,
                        Options = CreateOptionsJson("null", "object", "undefined", "number"),
                        CorrectAnswerIds = JsonSerializer.Serialize(new[] { "2" })
                    };

                    // --- Python Question Setup ---
                    var pyQuestion = new Question
                    {
                        Type = QuestionType.MultipleChoice,
                        Language = py.ShortCode,
                        Difficulty = DifficultyLevel.Easy,
                        Title = "Python String Multiplication",
                        QuestionText = "Mi a kimenet? print('3' * 2)",
                        CreatedBy = "SeederUser1",

                        // JAVÍTÁS: Kötelező mezők hozzáadása
                        Explanation = "Pythonban a string megszorozása egész számmal a string ismétlését jelenti.",
                        Tags = "[\"python\", \"strings\", \"operators\"]",
                        Metadata = "{}"
                    };

                    var pyMCQ = new MultipleChoiceQuestion
                    {
                        Question = pyQuestion,
                        Options = CreateOptionsJson("6", "33", "Hiba", "None"),
                        CorrectAnswerIds = JsonSerializer.Serialize(new[] { "2" })
                    };

                    // Add the base Question entities
                    db.Questions.AddRange(csharpQuestion, jsQuestion, pyQuestion);

                    // Add the specific MultipleChoiceQuestion entities
                    db.MultipleChoiceQuestions.AddRange(csharpMCQ, jsMCQ, pyMCQ);

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
