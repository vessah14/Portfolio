using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace backend.Model
{
    [Table("Message")]
    public class Message
    {
        [Key]
        [Column("id")]
        public Guid Id { get; set; }

        [Required]
        [Column("nom_envoyeur")]
        public string nom_envoyeur { get; set; } = string.Empty;

        [Required]
        [Column("email_envoyeur")]
        public string email_envoyeur { get; set; } = string.Empty;

        [Required]
        [Column("message")]
        public string message { get; set; } = string.Empty;

        [Column("create_at")]
        public DateTime create_at { get; set; }
    }
}