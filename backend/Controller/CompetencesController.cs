using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using backend.Data;
using backend.DTOs;
using backend.Model;

[ApiController]
[Route("api/[controller]")]
public class CompetencesController : ControllerBase
{
    private readonly PortfolioDbContext _context;

    public CompetencesController(PortfolioDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<CompetencesDto>>> GetCompetences()
    {
        var competences = await _context.Competences
            .OrderByDescending(c => c.create_at)
            .Select(c => new CompetencesDto
            {
                Id = c.Id,
                Nom = c.Nom,
                Niveau = c.Niveau,
                Progression = c.Progression,
                create_at = c.create_at
            })
            .ToListAsync();

        return Ok(competences);
    }

    [HttpGet("{id:guid}")]
    public async Task<ActionResult<CompetencesDto>> GetCompetence(Guid id)
    {
        var competence = await _context.Competences
            .Where(c => c.Id == id)
            .Select(c => new CompetencesDto
            {
                Id = c.Id,
                Nom = c.Nom,
                Niveau = c.Niveau,
                Progression = c.Progression,
                create_at = c.create_at
            })
            .FirstOrDefaultAsync();

        if (competence == null)
        {
            return NotFound();
        }

        return Ok(competence);
    }

    [HttpPost]
    public async Task<ActionResult<CompetencesDto>> PostCompetence(CompetencesCreateDto competenceDto)
    {
        if (competenceDto == null)
        {
            return BadRequest();
        }

        if (string.IsNullOrWhiteSpace(competenceDto.Nom))
        {
            return BadRequest("Le nom est requis.");
        }

        var progression = (short)Math.Clamp(competenceDto.Progression, 0, 100);

        var competence = new Competences
        {
            Nom = competenceDto.Nom,
            Niveau = ResolveNiveau(competenceDto.Niveau, progression),
            Progression = progression,
            create_at = DateTime.UtcNow
        };

        _context.Competences.Add(competence);
        await _context.SaveChangesAsync();

        var result = MapToDto(competence);

        return CreatedAtAction(nameof(GetCompetence), new { id = competence.Id }, result);
    }

    [HttpPut("{id:guid}")]
    public async Task<IActionResult> PutCompetence(Guid id, CompetencesCreateDto competenceDto)
    {
        if (competenceDto == null)
        {
            return BadRequest();
        }

        var competence = await _context.Competences.FindAsync(id);
        if (competence == null)
        {
            return NotFound();
        }

        if (string.IsNullOrWhiteSpace(competenceDto.Nom))
        {
            return BadRequest("Le nom est requis.");
        }

        competence.Nom = competenceDto.Nom;
        competence.Niveau = ResolveNiveau(competenceDto.Niveau, (short)Math.Clamp(competenceDto.Progression, 0, 100));
        competence.Progression = (short)Math.Clamp(competenceDto.Progression, 0, 100);
        competence.create_at = DateTime.UtcNow;

        try
        {
            await _context.SaveChangesAsync();
        }
        catch (DbUpdateConcurrencyException)
        {
            if (!CompetenceExists(id))
            {
                return NotFound();
            }

            throw;
        }

        return NoContent();
    }

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> DeleteCompetence(Guid id)
    {
        var competence = await _context.Competences.FindAsync(id);
        if (competence == null)
        {
            return NotFound();
        }

        _context.Competences.Remove(competence);
        await _context.SaveChangesAsync();

        return NoContent();
    }

    private bool CompetenceExists(Guid id)
    {
        return _context.Competences.Any(e => e.Id == id);
    }

    private static CompetencesDto MapToDto(Competences competence)
    {
        return new CompetencesDto
        {
            Id = competence.Id,
            Nom = competence.Nom,
            Niveau = competence.Niveau,
            Progression = competence.Progression,
            create_at = competence.create_at
        };
    }

    private static string ResolveNiveau(string? niveau, short progression)
    {
        if (!string.IsNullOrWhiteSpace(niveau))
        {
            return niveau.Trim();
        }

        return progression >= 85
            ? "Expert"
            : progression >= 60
                ? "Avancé"
                : "Intermédiaire";
    }
}
