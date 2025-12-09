using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace CodeLingo.API.Models
{
    public class RefreshToken
    {
        [Key]
        public string Id { get; set; } = Guid.NewGuid().ToString();

        [Required]
        [StringLength(450)]
        [ForeignKey("User")]
        public string UserId { get; set; }

        [Required]
        [StringLength(500)]
        public string Token { get; set; }

        [Required]
        public DateTime ExpiresAt { get; set; }

        public bool IsRevoked { get; set; } = false;

        // Navigation property
        public virtual User User { get; set; }

        [NotMapped]
        public bool IsExpired => DateTime.UtcNow >= ExpiresAt;

        [NotMapped]
        public bool IsActive => !IsRevoked && !IsExpired;
    }
}
