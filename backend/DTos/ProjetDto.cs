namespace backend.DTOs
{
    public class ProjetDto
    {
        public Guid Id { get; set; }
        public string titre { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string Photo_Url { get; set; } = string.Empty;
        public Guid CategorieId { get; set; }
        public string Lien { get; set; } = string.Empty;
        public DateTime create_at { get; set; }
    }

    public class ProjetCreateDto
    {
        public string titre { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string Photo_Url { get; set; } = string.Empty;
        public Guid CategorieId { get; set; }
        public string Lien { get; set; } = string.Empty;
    }
}
