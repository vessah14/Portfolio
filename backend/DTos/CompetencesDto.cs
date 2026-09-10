namespace backend.DTOs
{
    public class CompetencesDto
    {
        public Guid Id { get; set; }
        public string Nom { get; set; } = string.Empty;
        public string Niveau { get; set; } = string.Empty;
        public int Progression { get; set; }
        public DateTime create_at { get; set; }
    }

    public class CompetencesCreateDto
    {
        public string Nom { get; set; } = string.Empty;
        public string? Niveau { get; set; }
        public int Progression { get; set; }
    }
}
