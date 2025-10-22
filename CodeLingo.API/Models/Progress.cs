using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace CodeLingo.API.Models
{
    public class Progress
    {
        [Key]
        [ForeignKey("User")]
        public string UserId { get; set; }

        public int TotalScore { get; set; } = 0;
        public int Xp { get; set; } = 0;
        public int CurrentLevel { get; set; } = 1;
        public int Streak { get; set; } = 0;

        [Column(TypeName = "float")]
        public float Accuracy { get; set; } = 0.0f;

        public DateTime? LastSessionAt { get; set; }

        // Navigation property
        public virtual User User { get; set; }
    }
}
