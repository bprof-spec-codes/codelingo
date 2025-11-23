using CodeLingo.API.Models;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace CodeLingo.API.Data
{
    public class AppDbContext : IdentityDbContext<User>
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {
        }

        // Define all DbSet properties for the models
        public DbSet<User> Users => Set<User>();
        public DbSet<Progress> Progresses => Set<Progress>();
        public DbSet<Achievement> Achievements => Set<Achievement>();
        public DbSet<UserAchievement> UserAchievements => Set<UserAchievement>();
        public DbSet<Session> Sessions => Set<Session>();
        public DbSet<SessionQuestion> SessionQuestions => Set<SessionQuestion>();
        public DbSet<Question> Questions => Set<Question>();
        public DbSet<RefreshToken> RefreshTokens => Set<RefreshToken>();


        // FIX: Added the missing DbSet property
        public DbSet<MultipleChoiceQuestion> MultipleChoiceQuestions => Set<MultipleChoiceQuestion>();
        public DbSet<ProgrammingLanguage> ProgrammingLanguages => Set<ProgrammingLanguage>();

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // --- Configuration for RefreshToken entity ---
            modelBuilder.Entity<RefreshToken>(e =>
            {
                e.HasOne(rt => rt.User)
                    .WithMany(u => u.RefreshTokens)
                    .HasForeignKey(rt => rt.UserId)
                    .OnDelete(DeleteBehavior.Cascade);

                e.HasIndex(rt => rt.Token).IsUnique();
            });

            // --- Configuration for Question entity ---
            modelBuilder.Entity<Question>(e =>
            {
                e.Property(p => p.Language).HasMaxLength(20).IsRequired();
            });

            // --- Configuration for ProgrammingLanguage entity ---
            modelBuilder.Entity<ProgrammingLanguage>(e =>
            {
                e.HasKey(p => p.Id);
                e.Property(p => p.Name).HasMaxLength(100).IsRequired();
                e.Property(p => p.ShortCode).HasMaxLength(10).IsRequired();
                e.HasIndex(p => p.ShortCode).IsUnique();
            });

            // --- Configuration for MultipleChoiceQuestion (1-to-1) ---
            modelBuilder.Entity<MultipleChoiceQuestion>(e =>
            {
                e.HasKey(mcq => mcq.QuestionId);
                e.HasOne(mcq => mcq.Question)
                    .WithOne()
                    .HasForeignKey<MultipleChoiceQuestion>(mcq => mcq.QuestionId)
                    .OnDelete(DeleteBehavior.Cascade);
            });


            // --- Configuration for User and Progress (1-to-1 relationship) ---
            modelBuilder.Entity<Progress>()
                .HasOne(p => p.User)
                .WithOne(u => u.Progress)
                .HasForeignKey<Progress>(p => p.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            // --- Configuration for UserAchievement (Many-to-Many) ---
            modelBuilder.Entity<UserAchievement>()
                .HasOne(ua => ua.User)
                .WithMany(u => u.UserAchievements)
                .HasForeignKey(ua => ua.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<UserAchievement>()
                .HasOne(ua => ua.Achievement)
                .WithMany(a => a.UserAchievements)
                .HasForeignKey(ua => ua.AchievementId)
                .OnDelete(DeleteBehavior.Cascade);

            // --- Configuration for SessionQuestion (Many-to-Many) ---
            modelBuilder.Entity<SessionQuestion>()
                .HasOne(sq => sq.Session)
                .WithMany(s => s.SessionQuestions)
                .HasForeignKey(sq => sq.SessionId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<SessionQuestion>()
                .HasOne(sq => sq.Question)
                .WithMany(q => q.SessionQuestions)
                .HasForeignKey(sq => sq.QuestionId)
                .OnDelete(DeleteBehavior.Restrict);
        }
    }
}
