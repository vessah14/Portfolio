using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace backend.Model
{
    [Table("Projet")]
    public class Projet
    {
        [Key]
        [Column("id")]
        public Guid Id { get; set; }

        [Required]
        [Column("titre")]
        public string titre { get; set; } = string.Empty;

        [Required]
        [Column("description")]
        public string Description { get; set; } = string.Empty;

        [Required]
        [Column("photo_url")]
        public string Photo_Url { get; set; } = string.Empty;

        [Required]
        [Column("category_id")]
        public Guid CategorieId { get; set; }

        public Categorie? Categorie { get; set; }

        [Required]
        [Column("lien")]
        public string Lien { get; set; } = string.Empty;

        [Column("create_at")]
        public DateTime create_at { get; set; }
    }
}