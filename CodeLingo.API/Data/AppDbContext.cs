using CodeLingo.API.Models;
using Microsoft.EntityFrameworkCore;

namespace CodeLingo.API.Data
{
    public class AppDbContext(DbContextOptions<AppDbContext> options) : DbContext(options)
    {
        public DbSet<Question> Questions => Set<Question>();
        public DbSet<ProgrammingLanguage> ProgrammingLanguages => Set<ProgrammingLanguage>();

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Question>(e =>
            {
                e.Property(p => p.QuestionText).HasMaxLength(500).IsRequired();
                e.Property(p => p.Option1).HasMaxLength(200).IsRequired();
                e.Property(p => p.Option2).HasMaxLength(200).IsRequired();
                e.Property(p => p.Option3).HasMaxLength(200).IsRequired();
                e.Property(p => p.Option4).HasMaxLength(200).IsRequired();
                e.Property(p => p.CorrectOptionNumber).IsRequired();
                e.HasOne(p => p.ProgrammingLanguage)
                    .WithMany(l => l.Questions)
                    .HasForeignKey(p => p.ProgrammingLanguageId)
                    .OnDelete(DeleteBehavior.Restrict);
            });

            modelBuilder.Entity<ProgrammingLanguage>(e =>
            {
                e.Property(p => p.Name).HasMaxLength(100).IsRequired();
                e.Property(p => p.ShortCode).HasMaxLength(10).IsRequired();
            });
        }
    }
}
