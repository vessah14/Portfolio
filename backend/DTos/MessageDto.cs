namespace backend.DTOs
{
    public class MessageDto
    {
        public Guid Id { get; set; }
        public string nom_envoyeur { get; set; } = string.Empty;
        public string email_envoyeur { get; set; } = string.Empty;
        public string message { get; set; } = string.Empty;
        public DateTime create_at { get; set; }
    }

    public class MessageCreateDto
    {
        public string nom_envoyeur { get; set; } = string.Empty;
        public string email_envoyeur { get; set; } = string.Empty;
        public string message { get; set; } = string.Empty;
    }
}
