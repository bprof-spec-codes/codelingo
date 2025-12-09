using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace CodeLingo.API.Models
{
    public class UserAchievement
    {
        [Key]
        public string Id { get; set; } = Guid.NewGuid().ToString();

        [Required]
        [StringLength(450)]
        [ForeignKey("User")]
        public string UserId { get; set; }

        [Required]
        [StringLength(450)]
        [ForeignKey("Achievement")]
        public string AchievementId { get; set; }

        public DateTime DateClaimed { get; set; } = DateTime.UtcNow;

        // Navigation properties
        public virtual User User { get; set; }
        public virtual Achievement Achievement { get; set; }
    }
}
