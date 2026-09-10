using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace backend.Model
{
    [Table("Competence")]
    public class Competences
    {
        [Key]
        [Column("id")]
        public Guid Id { get; set; }

        [Required]
        [Column("nom")]
        public string Nom { get; set; } = string.Empty;

        [Required]
        [Column("niveau")]
        public string Niveau { get; set; } = string.Empty;

        [Required]
        [Column("progression")]
        public short Progression { get; set; }

        [Column("create_at")]
        public DateTime create_at { get; set; }
    }
}