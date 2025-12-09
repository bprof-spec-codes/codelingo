using CodeLingo.API.DTOs;
using CodeLingo.API.DTOs.Exceptions; // Assuming standard exceptions exist or I'll use generic ones
using CodeLingo.API.Models;
using static CodeLingo.API.Models.Enums;
using CodeLingo.API.Repositories;
using System.Text.Json;
using System.Text.Json.Nodes;

namespace CodeLingo.API.Logics
{
    public class QuestionService : IQuestionService
    {
        private readonly IQuestionRepository _repository;

        public QuestionService(IQuestionRepository repository)
        {
            _repository = repository;
        }

        public async Task<QuestionResponseDto> CreateQuestionAsync(QuestionCreateDto dto, string userId)
        {
            // 1. Validation
            if (!Enum.TryParse<QuestionType>(dto.Type, true, out var type))
            {
                throw new ArgumentException($"Invalid question type: {dto.Type}");
            }

            if (!Enum.TryParse<DifficultyLevel>(dto.Difficulty, true, out var difficulty))
            {
                throw new ArgumentException($"Invalid difficulty level: {dto.Difficulty}");
            }

            ValidateQuestionSpecifics(type, dto);

            // 2. Mapping
            var question = new Question
            {
                Type = type,
                Language = dto.Language,
                Difficulty = difficulty,
                Title = dto.Title,
                QuestionText = dto.QuestionText,
                Explanation = dto.Explanation ?? "",
                Tags = JsonSerializer.Serialize(dto.Tags ?? new List<string>()),
                Metadata = dto.Metadata?.ToJsonString() ?? "{}",
                CreatedBy = userId,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow,
                IsActive = true
            };

            _repository.Create(question);
            // Save to generate ID if needed, but we set ID in model. 
            // However, EF needs to track it before adding related entities if we don't set navigation property directly on them.
            // But we can set navigation property.
            
            if (type == QuestionType.MultipleChoice && dto.Options != null)
            {
                var mcq = new MultipleChoiceQuestion
                {
                    Question = question,
                    Options = JsonSerializer.Serialize(dto.Options),
                    CorrectAnswerIds = JsonSerializer.Serialize(dto.Options.Where(o => o.IsCorrect).Select(o => o.Text).ToList()), // Assuming Text is ID or we just store correct options
                    // Wait, CorrectAnswerIds usually stores IDs. But OptionDto doesn't have ID.
                    // If Options is just a list of texts, then index or text is the ID.
                    // Let's assume Text is unique or we use Index.
                    // Existing DbSeeder uses `item.CorrectAnswerIds`.
                    // Let's stick to what DbSeeder does if possible, but here we have DTO.
                    // I'll serialize the list of correct option texts for now.
                    AllowMultipleSelection = dto.Options.Count(o => o.IsCorrect) > 1,
                    ShuffleOptions = true 
                };
                // We need to add this to context. 
                // Since we don't have _mcqRepository injected here, we can add it to question.MultipleChoiceQuestion if we set it up.
                question.MultipleChoiceQuestion = mcq;
            }
            
            if (type == QuestionType.CodeCompletion)
            {
                 var ccq = new CodeCompletionQuestion
                 {
                     Question = question,
                     CodeSnippet = dto.CodeSnippet ?? "",
                     AcceptedAnswers = JsonSerializer.Serialize(dto.AcceptedAnswers ?? new List<string>())
                 };
                 question.CodeCompletionQuestion = ccq;
            }

            _repository.SaveChanges();

            return MapToDto(question);
        }

        public async Task<QuestionResponseDto> UpdateQuestionAsync(string id, QuestionUpdateDto dto, string userId)
        {
            var question = await _repository.GetByIdAsync(id);
            if (question == null) throw new KeyNotFoundException($"Question with ID {id} not found.");

            if (dto.Type != null && Enum.TryParse<QuestionType>(dto.Type, true, out var type))
            {
                question.Type = type;
            }
            
            if (dto.Language != null) question.Language = dto.Language;
            if (dto.Difficulty != null && Enum.TryParse<DifficultyLevel>(dto.Difficulty, true, out var diff))
            {
                question.Difficulty = diff;
            }
            
            if (dto.Title != null) question.Title = dto.Title;
            if (dto.QuestionText != null) question.QuestionText = dto.QuestionText;
            if (dto.Explanation != null) question.Explanation = dto.Explanation;
            if (dto.Tags != null) question.Tags = JsonSerializer.Serialize(dto.Tags);
            
            // Update Metadata
            var metadataNode = JsonNode.Parse(question.Metadata ?? "{}")?.AsObject() ?? new JsonObject();
            if (dto.Metadata != null)
            {
                // Merge or replace? Usually merge top-level keys.
                foreach (var kvp in dto.Metadata)
                {
                    metadataNode[kvp.Key] = kvp.Value?.DeepClone(); // JsonNode has DeepClone in .NET 6+? No, it doesn't. 
                    // Actually, we can just assign it if we don't mind sharing, but to be safe:
                    metadataNode[kvp.Key] = JsonNode.Parse(kvp.Value?.ToJsonString() ?? "null");
                }
            }
            
            // Update Options if MC
            if (dto.Options != null)
            {
                 metadataNode["options"] = JsonSerializer.SerializeToNode(dto.Options);
            }
            
            question.Metadata = metadataNode.ToJsonString();
            question.UpdatedAt = DateTime.UtcNow;
            // question.CreatedBy = userId; // Don't update creator? Or maybe LastModifiedBy? Model doesn't have LastModifiedBy.

            _repository.SaveChanges(); // Repository should have Update or just SaveChanges works if tracked.
            // IQuestionRepository extends IRepository which has SaveChanges. 
            // EF Core tracks entities so modifying and calling SaveChanges is enough.

            return MapToDto(question);
        }

        public async Task DeleteQuestionAsync(string id)
        {
            var question = await _repository.GetByIdAsync(id);
            if (question == null) throw new KeyNotFoundException($"Question with ID {id} not found.");
            
            _repository.Delete(question);
            _repository.SaveChanges();
        }

        public async Task<QuestionResponseDto> GetQuestionAsync(string id)
        {
            var question = await _repository.GetByIdAsync(id);
            if (question == null) throw new KeyNotFoundException($"Question with ID {id} not found.");
            return MapToDto(question);
        }

        public async Task<QuestionListResponseDto> GetQuestionsAsync(string? language, string? difficulty, string? type, string? title, string? questionText, int page, int pageSize)
        {
            DifficultyLevel? diffEnum = null;
            if (!string.IsNullOrEmpty(difficulty) && Enum.TryParse<DifficultyLevel>(difficulty, true, out var d)) diffEnum = d;

            QuestionType? typeEnum = null;
            if (!string.IsNullOrEmpty(type) && Enum.TryParse<QuestionType>(type, true, out var t)) typeEnum = t;

            var questions = await _repository.GetQuestionsAsync(language, diffEnum, typeEnum, title, questionText, page, pageSize);
            var totalItems = await _repository.CountQuestionsAsync(language, diffEnum, typeEnum, title, questionText);

            return new QuestionListResponseDto
            {
                Page = page,
                PageSize = pageSize,
                TotalItems = totalItems,
                TotalPages = (int)Math.Ceiling(totalItems / (double)pageSize),
                Items = questions.Select(MapToDto).ToList()
            };
        }

        private void ValidateQuestionSpecifics(QuestionType type, QuestionCreateDto dto)
        {
            if (type == QuestionType.MultipleChoice)
            {
                if (dto.Options == null || dto.Options.Count < 2)
                {
                    throw new ArgumentException("Multiple choice questions must have at least 2 options.");
                }
                if (!dto.Options.Any(o => o.IsCorrect))
                {
                    throw new ArgumentException("Multiple choice questions must have at least one correct option.");
                }
            }
            // Add CodeCompletion validation if needed (e.g. StarterCode required?)
        }

        private QuestionResponseDto MapToDto(Question q)
        {
            var dto = new QuestionResponseDto
            {
                Id = q.Id,
                Type = q.Type.ToString(),
                Language = q.Language,
                Difficulty = q.Difficulty.ToString(),
                Title = q.Title,
                QuestionText = q.QuestionText,
                Explanation = q.Explanation,
                Tags = string.IsNullOrEmpty(q.Tags) ? new List<string>() : JsonSerializer.Deserialize<List<string>>(q.Tags) ?? new List<string>(),
                Metadata = string.IsNullOrEmpty(q.Metadata) ? null : JsonNode.Parse(q.Metadata)?.AsObject(),
                CreatedAt = q.CreatedAt,
                UpdatedAt = q.UpdatedAt,
                CreatedBy = q.CreatedBy,
                IsActive = q.IsActive
            };

            // Extract Options from MC entity
            if (q.Type == QuestionType.MultipleChoice && q.MultipleChoiceQuestion != null)
            {
                try {
                    dto.Options = JsonSerializer.Deserialize<List<QuestionOptionDto>>(q.MultipleChoiceQuestion.Options);
                } catch {}
            }
            // Fallback to Metadata if entity is missing (backward compatibility or if seeded differently)
            else if (q.Type == QuestionType.MultipleChoice && dto.Metadata != null && dto.Metadata.ContainsKey("options"))
            {
                 try {
                    dto.Options = dto.Metadata["options"]?.Deserialize<List<QuestionOptionDto>>();
                } catch {}
            }

            if (q.Type == QuestionType.CodeCompletion && q.CodeCompletionQuestion != null)
            {
                dto.CodeSnippet = q.CodeCompletionQuestion.CodeSnippet;
                dto.AcceptedAnswers = string.IsNullOrEmpty(q.CodeCompletionQuestion.AcceptedAnswers) 
                    ? new List<string>() 
                    : JsonSerializer.Deserialize<List<string>>(q.CodeCompletionQuestion.AcceptedAnswers);
            }

            return dto;
        }
    }
}
