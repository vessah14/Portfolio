using backend.Data;
using backend.Model;
using Microsoft.EntityFrameworkCore;

namespace backend.Services;

public sealed class AdminSeedService
{
    private readonly PortfolioDbContext _db;
    private readonly IConfiguration _configuration;
    private readonly ILogger<AdminSeedService> _logger;

    public AdminSeedService(
        PortfolioDbContext db,
        IConfiguration configuration,
        ILogger<AdminSeedService> logger)
    {
        _db = db;
        _configuration = configuration;
        _logger = logger;
    }

    public async Task EnsureAdminAsync(CancellationToken cancellationToken = default)
    {
        if (!_configuration.GetValue<bool>("AdminSeed:Enabled"))
        {
            return;
        }

        var email = _configuration["AdminSeed:Email"]?.Trim().ToLowerInvariant();
        var password = _configuration["AdminSeed:Password"];
        var nom = _configuration["AdminSeed:Nom"]?.Trim();
        var prenom = _configuration["AdminSeed:Prenom"]?.Trim();

        if (string.IsNullOrWhiteSpace(email) ||
            string.IsNullOrWhiteSpace(password) ||
            string.IsNullOrWhiteSpace(nom) ||
            string.IsNullOrWhiteSpace(prenom))
        {
            _logger.LogWarning(
                "AdminSeed est activé, mais les variables AdminSeed:Email, AdminSeed:Password, AdminSeed:Nom et AdminSeed:Prenom doivent toutes être renseignées.");
            return;
        }

        var existingUser = await _db.Users
            .FirstOrDefaultAsync(user => user.Email.ToLower() == email, cancellationToken);

        if (existingUser is not null)
        {
            _logger.LogInformation(
                "Le compte administrateur {Email} existe déjà. Aucun mot de passe existant n'a été remplacé.",
                email);
            return;
        }

        var admin = new User
        {
            Id = Guid.NewGuid(),
            Nom = nom,
            Prenom = prenom,
            Email = email,
            Password = BCrypt.Net.BCrypt.HashPassword(password),
            create_at = DateTime.UtcNow
        };

        _db.Users.Add(admin);
        await _db.SaveChangesAsync(cancellationToken);

        _logger.LogInformation(
            "Compte administrateur initial créé pour {Email}.",
            email);
    }
}
