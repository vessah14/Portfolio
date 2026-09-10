namespace backend.DTOs
{
    public class CategorieDto
    {
        public Guid Id { get; set; }
        public string Nom { get; set; } = string.Empty;
        public DateTime create_at { get; set; }
    }

    public class CategorieCreateDto
    {
        public string Nom { get; set; } = string.Empty;
    }
}
