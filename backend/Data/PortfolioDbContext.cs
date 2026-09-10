using Microsoft.EntityFrameworkCore;
using backend.Model;

namespace backend.Data
{
    public class PortfolioDbContext : DbContext
    {
        public PortfolioDbContext(DbContextOptions<PortfolioDbContext> options) : base(options)
        {
        }

        public DbSet<User> Users { get; set; } = null!;
        public DbSet<Categorie> Categories { get; set; } = null!;
        public DbSet<Message> Messages { get; set; } = null!;
        public DbSet<Projet> Projets { get; set; } = null!;
        public DbSet<Competences> Competences { get; set; } = null!;

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<Projet>(entity =>
            {
                entity.Property(p => p.Id)
                    .HasColumnName("id");

                entity.Property(p => p.CategorieId)
                    .HasColumnName("category_id");

                entity.Property(p => p.Description)
                    .HasColumnName("description");

                entity.Property(p => p.Photo_Url)
                    .HasColumnName("photo_url");

                entity.Property(p => p.Lien)
                    .HasColumnName("lien");

                entity.Property(p => p.titre)
                    .HasColumnName("titre");

                entity.Property(p => p.create_at)
                    .HasColumnName("create_at");

                entity.HasOne(p => p.Categorie)
                    .WithMany(c => c.Projets)
                    .HasForeignKey(p => p.CategorieId)
                    .OnDelete(DeleteBehavior.Restrict);
            });

            modelBuilder.Entity<Competences>(entity =>
            {
                entity.Property(c => c.Id)
                    .HasColumnName("id");

                entity.Property(c => c.Nom)
                    .HasColumnName("nom");

                entity.Property(c => c.Niveau)
                    .HasColumnName("niveau");

                entity.Property(c => c.Progression)
                    .HasColumnName("progression");

                entity.Property(c => c.create_at)
                    .HasColumnName("create_at");
            });
        }
    }
}