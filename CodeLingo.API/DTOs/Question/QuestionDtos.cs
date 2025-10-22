using System.ComponentModel.DataAnnotations;

namespace CodeLingo.API.DTOs.Question
{
    public class QuestionDtos
    {
        public class QuestionDto
        {
            public string Id { get; set; }
            public string Type { get; set; }
            public string Language { get; set; }
            public string Difficulty { get; set; }
            public string Title { get; set; }
            public string QuestionText { get; set; }
            public string Explanation { get; set; }
            public string[] Tags { get; set; }
            public QuestionMetadataDto Metadata { get; set; }
            public AnswerOptionDto[] Options { get; set; }
            public DateTime CreatedAt { get; set; }
            public DateTime UpdatedAt { get; set; }
            public bool IsActive { get; set; }
        }

        public class QuestionMetadataDto
        {
            public string Category { get; set; }
            public string Topic { get; set; }
            public string Source { get; set; }
        }

        public class AnswerOptionDto
        {
            public string Text { get; set; }
            public bool IsCorrect { get; set; }
        }

        public class CreateQuestionDto
        {
            [Required]
            public string Type { get; set; }

            [Required]
            public string Language { get; set; }

            [Required]
            public string Difficulty { get; set; }

            [Required]
            public string Title { get; set; }

            [Required]
            public string QuestionText { get; set; }

            public string Explanation { get; set; }
            public string[] Tags { get; set; }
            public QuestionMetadataDto Metadata { get; set; }
            public AnswerOptionDto[] Options { get; set; }
        }

        public class UpdateQuestionDto
        {
            public string Type { get; set; }
            public string Language { get; set; }
            public string Difficulty { get; set; }
            public string Title { get; set; }
            public string QuestionText { get; set; }
            public string Explanation { get; set; }
            public string[] Tags { get; set; }
            public QuestionMetadataDto Metadata { get; set; }
            public AnswerOptionDto[] Options { get; set; }
        }

        public class QuestionListDto
        {
            public int Page { get; set; }
            public int PageSize { get; set; }
            public int TotalItems { get; set; }
            public int TotalPages { get; set; }
            public QuestionDto[] Items { get; set; }
        }
    }
}
