using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using backend.Data;
using backend.DTOs;
using backend.Model;

[ApiController]
[Route("api/[controller]")]
public class CategoriesController : ControllerBase
{
    private readonly PortfolioDbContext _context;

    public CategoriesController(PortfolioDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<CategorieDto>>> GetCategories()
    {
        var categories = await _context.Categories
            .OrderBy(c => c.Nom)
            .Select(c => new CategorieDto
            {
                Id = c.Id,
                Nom = c.Nom,
                create_at = c.create_at
            })
            .ToListAsync();

        return Ok(categories);
    }

    [HttpGet("{id:guid}")]
    public async Task<ActionResult<CategorieDto>> GetCategory(Guid id)
    {
        var categorie = await _context.Categories
            .Where(c => c.Id == id)
            .Select(c => new CategorieDto
            {
                Id = c.Id,
                Nom = c.Nom,
                create_at = c.create_at
            })
            .FirstOrDefaultAsync();

        if (categorie == null)
        {
            return NotFound();
        }

        return Ok(categorie);
    }
}
