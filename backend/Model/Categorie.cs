using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace backend.Model
{
    [Table("Categorie")]
    public class Categorie
    {
        [Key]
        [Column("id")]
        public Guid Id { get; set; }

        [Required]
        [Column("nom")]
        public string Nom { get; set; } = string.Empty;

        [Column("create_at")]
        public DateTime create_at { get; set; }

        public ICollection<Projet> Projets { get; set; } = new List<Projet>();
    }
}