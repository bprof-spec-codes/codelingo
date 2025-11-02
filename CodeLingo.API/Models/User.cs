using System.ComponentModel.DataAnnotations;
using System;

namespace CodeLingo.API.Models
{
    public class User
    {
        [Key]
        public string Id { get; set; } = Guid.NewGuid().ToString();

        [Required]
        [StringLength(50)]
        public string Username { get; set; }

        [Required]
        [StringLength(255)]
        public string PasswordHash { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
        public bool IsActive { get; set; } = true;

        // Navigation properties
        public virtual ICollection<Session> Sessions { get; set; }
        public virtual Progress Progress { get; set; }
        public virtual ICollection<UserAchievement> UserAchievements { get; set; }
    }
}
