using System.ComponentModel.DataAnnotations;
using System.Text.Json.Nodes;

namespace CodeLingo.API.DTOs
{
    public class QuestionCreateDto
    {
        [Required]
        public string Type { get; set; }

        [Required]
        public string Language { get; set; }

        [Required]
        public string Difficulty { get; set; }

        [Required]
        [StringLength(255)]
        public string Title { get; set; }

        [Required]
        public string QuestionText { get; set; }

        public string? Explanation { get; set; }

        public List<string>? Tags { get; set; }

        public JsonObject? Metadata { get; set; }

        // Multiple Choice specific
        public List<QuestionOptionDto>? Options { get; set; }

        // Code Completion specific
        public string? StarterCode { get; set; }
        public string? CorrectAnswer { get; set; }
        public List<string>? Hints { get; set; }
        public CodeConstraintsDto? Constraints { get; set; }
    }

    public class QuestionUpdateDto
    {
        public string? Type { get; set; }
        public string? Language { get; set; }
        public string? Difficulty { get; set; }
        
        [StringLength(255)]
        public string? Title { get; set; }
        
        public string? QuestionText { get; set; }
        public string? Explanation { get; set; }
        public List<string>? Tags { get; set; }
        public JsonObject? Metadata { get; set; }
        public List<QuestionOptionDto>? Options { get; set; }
    }

    public class QuestionOptionDto
    {
        [Required]
        public string Text { get; set; }
        
        [Required]
        public bool IsCorrect { get; set; }
    }

    public class CodeConstraintsDto
    {
        public int MaxLines { get; set; }
        public int MaxCharacters { get; set; }
        public List<string>? ForbiddenKeywords { get; set; }
    }

    public class QuestionResponseDto
    {
        public string Id { get; set; }
        public string Type { get; set; }
        public string Language { get; set; }
        public string Difficulty { get; set; }
        public string Title { get; set; }
        public string QuestionText { get; set; }
        public string? Explanation { get; set; }
        public List<string> Tags { get; set; } = new();
        public JsonObject? Metadata { get; set; }
        public List<QuestionOptionDto>? Options { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
        public string CreatedBy { get; set; }
        public bool IsActive { get; set; }
    }

    public class QuestionListResponseDto
    {
        public int Page { get; set; }
        public int PageSize { get; set; }
        public int TotalItems { get; set; }
        public int TotalPages { get; set; }
        public List<QuestionResponseDto> Items { get; set; } = new();
    }
}
