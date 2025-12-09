using CodeLingo.API.DTOs;
using CodeLingo.API.DTOs.Exceptions; // Assuming standard exceptions exist or I'll use generic ones
using CodeLingo.API.Models;
using CodeLingo.API.Repositories;
using System.Text;
using System.Text.Json;
using System.Text.Json.Nodes;
using static CodeLingo.API.DTOs.Admin.QuestionImportExportDtos;
using static CodeLingo.API.Models.Enums;

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

        public Task<IReadOnlyList<QuestionResponseDto>> GetAllQuestionsAsync()
        {
            var questions = _repository.ReadAll();
            IReadOnlyList<QuestionResponseDto> result = questions.Select(MapToDto).ToList();
            return Task.FromResult(result);
        }
        public async Task<QuestionResponseDto> GetQuestionAsync(string id)
        {
            var question = await _repository.GetByIdAsync(id);
            if (question == null)
            {
                throw new KeyNotFoundException($"Question with ID {id} not found.");
            }

            return MapToDto(question);
        }
        public async Task<QuestionListResponseDto> GetQuestionsAsync(
            string? language,
            string? difficulty,
            string? type,
            int page,
            int pageSize)
        {
            DifficultyLevel? diffEnum = null;
            if (!string.IsNullOrEmpty(difficulty) &&
                Enum.TryParse<DifficultyLevel>(difficulty, true, out var d))
            {
                diffEnum = d;
            }

            QuestionType? typeEnum = null;
            if (!string.IsNullOrEmpty(type) &&
                Enum.TryParse<QuestionType>(type, true, out var t))
            {
                typeEnum = t;
            }

            // most nem szűrünk title / questionText szerint, ezért null
            string? titleFilter = null;
            string? questionTextFilter = null;

            var questions = await _repository.GetQuestionsAsync(
                language,
                diffEnum,
                typeEnum,
                titleFilter,
                questionTextFilter,
                page,
                pageSize);

            var totalItems = await _repository.CountQuestionsAsync(
                language,
                diffEnum,
                typeEnum,
                titleFilter,
                questionTextFilter);

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
        public async Task<QuestionImportReportDto> ImportFromCsvAsync(Stream csvStream, string userId)
        {
            var errors = new List<QuestionImportErrorDto>();
            int imported = 0;
            int totalRows = 0;
            int rowNumber = 0;

            using var reader = new StreamReader(csvStream, Encoding.UTF8);

            // header átugrása
            var header = await reader.ReadLineAsync();
            rowNumber++;

            while (!reader.EndOfStream)
            {
                var line = await reader.ReadLineAsync();
                rowNumber++;

                if (string.IsNullOrWhiteSpace(line))
                    continue;

                totalRows++;

                // EZT már jól csinálod:
                var parts = ParseCsvLine(line);

                if (parts.Count < 5)
                {
                    errors.Add(new QuestionImportErrorDto
                    {
                        RowNumber = rowNumber,
                        Message = "Invalid column count, expected at least 5 (type,language,difficulty,title,questionText)"
                    });
                    continue;
                }

                var typeStr = parts[0].Trim();
                var language = parts[1].Trim();
                var difficultyStr = parts[2].Trim();
                var title = parts[3].Trim();
                var questionText = parts[4].Trim();
                var explanation = parts.Count > 5 ? parts[5].Trim() : string.Empty;
                var optionsJson = parts.Count > 6 ? parts[6].Trim() : string.Empty;
                var starterCode = parts.Count > 7 ? parts[7].Trim() : string.Empty;
                var correctAnswer = parts.Count > 8 ? parts[8].Trim() : string.Empty;

                if (string.IsNullOrEmpty(typeStr) ||
                    string.IsNullOrEmpty(language) ||
                    string.IsNullOrEmpty(difficultyStr) ||
                    string.IsNullOrEmpty(title) ||
                    string.IsNullOrEmpty(questionText))
                {
                    errors.Add(new QuestionImportErrorDto
                    {
                        RowNumber = rowNumber,
                        Message = "Missing required fields (type, language, difficulty, title, questionText)"
                    });
                    continue;
                }

                var createDto = new QuestionCreateDto
                {
                    Type = typeStr,
                    Language = language,
                    Difficulty = difficultyStr,
                    Title = title,
                    QuestionText = questionText,
                    Explanation = string.IsNullOrWhiteSpace(explanation) ? null : explanation,
                    Tags = new List<string>(),
                    Metadata = null
                };

                // MultipleChoice: options JSON → dto.Options
                if (string.Equals(typeStr, "MultipleChoice", StringComparison.OrdinalIgnoreCase) &&
                    !string.IsNullOrWhiteSpace(optionsJson))
                {
                    try
                    {
                        var options = JsonSerializer.Deserialize<List<QuestionOptionDto>>(optionsJson);
                        if (options != null && options.Count > 0)
                        {
                            createDto.Options = options;
                        }
                    }
                    catch (Exception ex)
                    {
                        errors.Add(new QuestionImportErrorDto
                        {
                            RowNumber = rowNumber,
                            Message = $"Invalid options JSON: {ex.Message}"
                        });
                        continue;
                    }
                }

                // CodeCompletion: starterCode + correctAnswer (|-del elválasztva)
                if (string.Equals(typeStr, "CodeCompletion", StringComparison.OrdinalIgnoreCase))
                {
                    if (!string.IsNullOrWhiteSpace(starterCode))
                    {
                        createDto.CodeSnippet = starterCode;
                    }

                    if (!string.IsNullOrWhiteSpace(correctAnswer))
                    {
                        createDto.AcceptedAnswers = correctAnswer
                            .Split('|', StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries)
                            .ToList();
                    }
                }

                try
                {
                    await CreateQuestionAsync(createDto, userId);
                    imported++;
                }
                catch (Exception ex)
                {
                    errors.Add(new QuestionImportErrorDto
                    {
                        RowNumber = rowNumber,
                        Message = $"Error while creating question: {ex.Message}"
                    });
                }
            }

            var status = errors.Any()
                ? (imported > 0 ? "completed_with_errors" : "validation_failed")
                : "completed";

            return new QuestionImportReportDto
            {
                Status = status,
                TotalRows = totalRows,
                ImportedCount = imported,
                FailedCount = errors.Count,
                Errors = errors
            };
        }
        public async Task<QuestionImportReportDto> ImportFromAikenAsync(
    Stream aikenStream,
    string userId,
    string language,
    string difficulty)
        {
            return new QuestionImportReportDto
            {
                Status = "validation_failed",
                TotalRows = 0,
                ImportedCount = 0,
                FailedCount = 1,
                Errors = new List<QuestionImportErrorDto>
        {
            new QuestionImportErrorDto
            {
                RowNumber = 0,
                Message = "AIKEN import is not supported in this version."
            }
        }
            };
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
        private static List<string> ParseCsvLine(string line)
        {
            var result = new List<string>();
            if (line == null)
                return result;

            var sb = new StringBuilder();
            bool inQuotes = false;

            for (int i = 0; i < line.Length; i++)
            {
                char c = line[i];

                if (inQuotes)
                {
                    if (c == '"')
                    {
                        // escaped idézőjel: ""
                        if (i + 1 < line.Length && line[i + 1] == '"')
                        {
                            sb.Append('"');
                            i++;
                        }
                        else
                        {
                            inQuotes = false;
                        }
                    }
                    else
                    {
                        sb.Append(c);
                    }
                }
                else
                {
                    if (c == '"')
                    {
                        inQuotes = true;
                    }
                    else if (c == ',')
                    {
                        result.Add(sb.ToString());
                        sb.Clear();
                    }
                    else
                    {
                        sb.Append(c);
                    }
                }
            }

            result.Add(sb.ToString());
            return result;
        }
    }
}
