using System.ComponentModel.DataAnnotations;

namespace CodeLingo.API.DTOs
{
    public class LanguageCreateDto
    {
        [Required]
        public string Name { get; set; }
        
        [Required]
        public string ShortCode { get; set; }
        
        [Required]
        public string Version { get; set; }
    }

    public class LanguageUpdateDto
    {
        public string? Name { get; set; }
        public string? ShortCode { get; set; }
        public string? Version { get; set; }
    }

    public class LanguageResponseDto
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string ShortCode { get; set; }
        public string Version { get; set; }
    }
}
