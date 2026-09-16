using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Net;
using System.Net.Mail;
using backend.Data;
using backend.DTOs;
using backend.Model;

[ApiController]
[Route("api/[controller]")]
public class MessageController : ControllerBase
{
    private readonly PortfolioDbContext _context;
    private readonly EmailService _emailService;
    private readonly IConfiguration _configuration;

    public MessageController(
        PortfolioDbContext context,
        EmailService emailService,
        IConfiguration configuration)
    {
        _context = context;
        _emailService = emailService;
        _configuration = configuration;
    }

    [Authorize]
    [HttpGet]
    public async Task<ActionResult<IEnumerable<MessageDto>>> GetMessages()
    {
        var messages = await _context.Messages
            .OrderByDescending(m => m.create_at)
            .Select(m => new MessageDto
            {
                Id = m.Id,
                nom_envoyeur = m.nom_envoyeur,
                email_envoyeur = m.email_envoyeur,
                message = m.message,
                create_at = m.create_at
            })
            .ToListAsync();

        return Ok(messages);
    }

    [Authorize]
    [HttpGet("{id}")]
    public async Task<ActionResult<MessageDto>> GetMessage(Guid id)
    {
        var message = await _context.Messages
            .Where(m => m.Id == id)
            .Select(m => new MessageDto
            {
                Id = m.Id,
                nom_envoyeur = m.nom_envoyeur,
                email_envoyeur = m.email_envoyeur,
                message = m.message,
                create_at = m.create_at
            })
            .FirstOrDefaultAsync();

        if (message == null)
        {
            return NotFound();
        }

        return Ok(message);
    }

    [HttpPost]
    public async Task<ActionResult<MessageDto>> PostMessage(MessageCreateDto messageDto)
    {
        if (messageDto == null)
        {
            return BadRequest();
        }

        if (string.IsNullOrWhiteSpace(messageDto.nom_envoyeur) ||
            string.IsNullOrWhiteSpace(messageDto.email_envoyeur) ||
            string.IsNullOrWhiteSpace(messageDto.message))
        {
            return BadRequest("Tous les champs sont requis.");
        }

        if (!MailAddress.TryCreate(messageDto.email_envoyeur.Trim(), out _))
        {
            return BadRequest("L'adresse e-mail est invalide.");
        }

        var message = new Message
        {
            nom_envoyeur = messageDto.nom_envoyeur.Trim(),
            email_envoyeur = messageDto.email_envoyeur.Trim(),
            message = messageDto.message.Trim(),
            create_at = DateTime.UtcNow
        };

        _context.Messages.Add(message);
        await _context.SaveChangesAsync();

        var recipient = _configuration["Smtp:NotificationRecipient"]
            ?? _configuration["Smtp:From"];

        if (!string.IsNullOrWhiteSpace(recipient))
        {
            var senderName = WebUtility.HtmlEncode(message.nom_envoyeur);
            var senderEmail = WebUtility.HtmlEncode(message.email_envoyeur);
            var senderMessage = WebUtility.HtmlEncode(message.message).Replace("\n", "<br />");
            var htmlBody = $"""
                <h3>Nouveau message reçu</h3>
                <p><strong>De :</strong> {senderName} ({senderEmail})</p>
                <p><strong>Message :</strong></p>
                <p>{senderMessage}</p>
                """;

            await _emailService.SendEmailAsync(
                recipient,
                $"Nouveau message depuis le portfolio - {message.nom_envoyeur}",
                htmlBody);
        }

        var result = new MessageDto
        {
            Id = message.Id,
            nom_envoyeur = message.nom_envoyeur,
            email_envoyeur = message.email_envoyeur,
            message = message.message,
            create_at = message.create_at
        };

        return CreatedAtAction(nameof(GetMessage), new { id = message.Id }, result);
    }

    [Authorize]
    [HttpPut("{id}")]
    public async Task<IActionResult> PutMessage(Guid id, MessageCreateDto messageDto)
    {
        if (messageDto == null)
        {
            return BadRequest();
        }

        var message = await _context.Messages.FindAsync(id);
        if (message == null)
        {
            return NotFound();
        }

        if (string.IsNullOrWhiteSpace(messageDto.nom_envoyeur) ||
            string.IsNullOrWhiteSpace(messageDto.email_envoyeur) ||
            string.IsNullOrWhiteSpace(messageDto.message) ||
            !MailAddress.TryCreate(messageDto.email_envoyeur.Trim(), out _))
        {
            return BadRequest("Les données du message sont invalides.");
        }

        message.nom_envoyeur = messageDto.nom_envoyeur.Trim();
        message.email_envoyeur = messageDto.email_envoyeur.Trim();
        message.message = messageDto.message.Trim();
        message.create_at = DateTime.UtcNow;

        try
        {
            await _context.SaveChangesAsync();
        }
        catch (DbUpdateConcurrencyException)
        {
            if (!MessageExists(id))
            {
                return NotFound();
            }

            throw;
        }

        return NoContent();
    }

    [Authorize]
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteMessage(Guid id)
    {
        var message = await _context.Messages.FindAsync(id);
        if (message == null)
        {
            return NotFound();
        }

        _context.Messages.Remove(message);
        await _context.SaveChangesAsync();

        return NoContent();
    }

    private bool MessageExists(Guid id)
    {
        return _context.Messages.Any(e => e.Id == id);
    }
}
