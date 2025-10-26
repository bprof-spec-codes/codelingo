using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace CodeLingo.API.Models
{
    public class Achievement
    {
        [Key]
        public string Id { get; set; } = Guid.NewGuid().ToString();

        [Required]
        [StringLength(100)]
        public string Name { get; set; }

        [Required]
        [Column(TypeName = "text")]
        public string Description { get; set; }

        public int Points { get; set; } = 0;

        // Navigation properties
        public virtual ICollection<UserAchievement> UserAchievements { get; set; }
    }
}
