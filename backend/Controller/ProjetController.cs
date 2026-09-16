using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using backend.Data;
using backend.DTOs;
using backend.Model;
using backend.Services;

[ApiController]
[Route("api/[controller]")]
public class ProjetController : ControllerBase
{
    private readonly PortfolioDbContext _context;
    private readonly CloudinaryService _cloudinaryService;

    public ProjetController(PortfolioDbContext context, CloudinaryService cloudinaryService)
    {
        _context = context;
        _cloudinaryService = cloudinaryService;
    }

    [HttpGet]
    public async Task<IActionResult> GetProjets()
    {
        var projets = await _context.Projets
            .OrderByDescending(p => p.create_at)
            .Select(p => new ProjetDto
            {
                Id = p.Id,
                titre = p.titre,
                Description = p.Description,
                Photo_Url = p.Photo_Url,
                CategorieId = p.CategorieId,
                Lien = p.Lien,
                create_at = p.create_at
            })
            .ToListAsync();

        return Ok(projets);
    }

    [HttpGet("{id:guid}")]
    public async Task<IActionResult> GetProjetById(Guid id)
    {
        var projet = await _context.Projets
            .FirstOrDefaultAsync(p => p.Id == id);

        if (projet == null)
        {
            return NotFound();
        }

        return Ok(MapToDto(projet));
    }

    [Authorize]
    [HttpPost]
    public async Task<IActionResult> CreateProjet([FromForm] ProjetCreateDto dto, IFormFile? file)
    {
        if (dto == null)
        {
            return BadRequest("Données invalides.");
        }

        if (string.IsNullOrWhiteSpace(dto.titre) ||
            string.IsNullOrWhiteSpace(dto.Description) ||
            string.IsNullOrWhiteSpace(dto.Lien) ||
            dto.CategorieId == Guid.Empty)
        {
            return BadRequest("Titre, description, lien et catégorie sont requis.");
        }

        var categorieExists = await _context.Categories.AnyAsync(c => c.Id == dto.CategorieId);
        if (!categorieExists)
        {
            return BadRequest("La catégorie associée est introuvable.");
        }

        if (file == null || file.Length == 0)
        {
            return BadRequest("Une image est requise pour créer un projet.");
        }

        try
        {
            var imageUrl = await _cloudinaryService.UploadImageAsync(file, "portfolio/projects");

            var projet = new Projet
            {
                titre = dto.titre,
                Description = dto.Description,
                Photo_Url = imageUrl,
                CategorieId = dto.CategorieId,
                Lien = dto.Lien,
                create_at = DateTime.UtcNow
            };

            _context.Projets.Add(projet);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetProjetById), new { id = projet.Id }, MapToDto(projet));
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }

    [Authorize]
    [HttpPut("{id:guid}")]
    public async Task<IActionResult> UpdateProjet(Guid id, [FromForm] ProjetCreateDto dto, IFormFile? file)
    {
        if (dto == null)
        {
            return BadRequest("Données invalides.");
        }

        if (string.IsNullOrWhiteSpace(dto.titre) ||
            string.IsNullOrWhiteSpace(dto.Description) ||
            string.IsNullOrWhiteSpace(dto.Lien) ||
            dto.CategorieId == Guid.Empty)
        {
            return BadRequest("Titre, description, lien et catégorie sont requis.");
        }

        var projet = await _context.Projets.FirstOrDefaultAsync(p => p.Id == id);
        if (projet == null)
        {
            return NotFound();
        }

        var categorieExists = await _context.Categories.AnyAsync(c => c.Id == dto.CategorieId);
        if (!categorieExists)
        {
            return BadRequest("La catégorie associée est introuvable.");
        }

        try
        {
            if (file != null && file.Length > 0)
            {
                var imageUrl = await _cloudinaryService.UploadImageAsync(file, "portfolio/projects");
                projet.Photo_Url = imageUrl;
            }

            projet.titre = dto.titre;
            projet.Description = dto.Description;
            projet.CategorieId = dto.CategorieId;
            projet.Lien = dto.Lien;

            await _context.SaveChangesAsync();

            return Ok(MapToDto(projet));
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }

    [Authorize]
    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> DeleteProjet(Guid id)
    {
        var projet = await _context.Projets.FirstOrDefaultAsync(p => p.Id == id);

        if (projet == null)
        {
            return NotFound();
        }

        _context.Projets.Remove(projet);
        await _context.SaveChangesAsync();

        return NoContent();
    }

    private static ProjetDto MapToDto(Projet projet)
    {
        return new ProjetDto
        {
            Id = projet.Id,
            titre = projet.titre,
            Description = projet.Description,
            Photo_Url = projet.Photo_Url,
            CategorieId = projet.CategorieId,
            Lien = projet.Lien,
            create_at = projet.create_at
        };
    }
}
