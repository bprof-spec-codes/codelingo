using CodeLingo.API.DTOs;
using CodeLingo.API.Models;
using System.Text.Json;
using static CodeLingo.API.Models.Enums;

namespace CodeLingo.API.Data
{
    public static class DbSeeder
    {
        public static async Task SeedAsync(AppDbContext context)
        {
            // Seed Programming Languages
            if (!context.ProgrammingLanguages.Any())
            {
                var csharp = new ProgrammingLanguage { Name = "C#", ShortCode = "csharp" };
                var js = new ProgrammingLanguage { Name = "JavaScript", ShortCode = "js" };
                var py = new ProgrammingLanguage { Name = "Python", ShortCode = "py" };
                context.ProgrammingLanguages.AddRange(csharp, js, py);
                await context.SaveChangesAsync();
            }

            // Check if we already have questions
            if (context.Questions.Any())
            {
                return;
            }

            var seedDataPath = "seedsettings.json";
            if (!File.Exists(seedDataPath))
            {
                return;
            }

            var jsonString = await File.ReadAllTextAsync(seedDataPath);
            var options = new JsonSerializerOptions
            {
                PropertyNameCaseInsensitive = true,
                Converters = { new System.Text.Json.Serialization.JsonStringEnumConverter() }
            };
            var seedData = JsonSerializer.Deserialize<List<SeedDataDto>>(jsonString, options);

            if (seedData == null || !seedData.Any())
            {
                return;
            }

            foreach (var item in seedData)
            {
                var question = new Question
                {
                    Type = item.Type,
                    Language = item.Language,
                    Difficulty = item.Difficulty,
                    Title = item.Title,
                    QuestionText = item.QuestionText,
                    Explanation = item.Explanation,
                    Tags = JsonSerializer.Serialize(item.Tags),
                    Metadata = JsonSerializer.Serialize(item.Metadata),
                    CreatedBy = "system", // Or a specific admin ID
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow,
                    IsActive = true
                };

                context.Questions.Add(question);
                
                // We need to save changes here to get the generated ID for the question
                // However, since we are setting the ID in the model (Guid.NewGuid().ToString()), we might not need to save immediately if we use that ID.
                // But let's follow the standard EF Core flow.
                
                if (item.Type == QuestionType.MultipleChoice)
                {
                    var mcq = new MultipleChoiceQuestion
                    {
                        Question = question, // Link navigation property
                        Options = JsonSerializer.Serialize(item.Options),
                        CorrectAnswerIds = JsonSerializer.Serialize(item.CorrectAnswerIds),
                        AllowMultipleSelection = item.AllowMultipleSelection,
                        ShuffleOptions = item.ShuffleOptions
                    };
                    context.MultipleChoiceQuestions.Add(mcq);
                }
            }

            await context.SaveChangesAsync();
            Console.WriteLine($"Seeded {seedData.Count} questions from JSON.");
        }
    }
}
