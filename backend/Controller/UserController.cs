using Microsoft.AspNetCore.Mvc;
using backend.Data;
using backend.Model;
using backend.DTOs;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using BCrypt.Net;

[ApiController]
[Route("api/[controller]")]
public class UserController : ControllerBase
{
    private readonly PortfolioDbContext _contest;
    private readonly IConfiguration _configuration;

    public UserController(PortfolioDbContext contest, IConfiguration configuration)
    {
        _contest = contest;
        _configuration = configuration;
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register(UserRegisterDto user)
    {
        if (user == null ||
            string.IsNullOrWhiteSpace(user.Nom) ||
            string.IsNullOrWhiteSpace(user.Prenom) ||
            string.IsNullOrWhiteSpace(user.Email) ||
            string.IsNullOrWhiteSpace(user.Password))
        {
            return BadRequest("Invalid user data.");
        }

        var existingUser = await _contest.Users.FirstOrDefaultAsync(u => u.Email == user.Email || u.Nom == user.Nom);
        if (existingUser != null)
        {
            return Conflict("Username or email already exists.");
        }

        var hashedPassword = BCrypt.Net.BCrypt.HashPassword(user.Password);

        var newUser = new User
        {
            Id = Guid.NewGuid(),
            Nom = user.Nom,
            Prenom = user.Prenom,
            Email = user.Email,
            Password = hashedPassword,
            create_at = DateTime.UtcNow
        };

        _contest.Users.Add(newUser);
        await _contest.SaveChangesAsync();

        return Ok("User registered successfully.");
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login(UserLoginDto user)
    {
        if (user == null || string.IsNullOrEmpty(user.Email) || string.IsNullOrEmpty(user.Password))
        {
            return BadRequest("Invalid login data.");
        }

        var existingUser = await _contest.Users.FirstOrDefaultAsync(u => u.Email == user.Email);
        if (existingUser == null || !BCrypt.Net.BCrypt.Verify(user.Password, existingUser.Password))
        {
            return Unauthorized("Invalid email or password.");
        }

        // Generate JWT token
        var tokenHandler = new JwtSecurityTokenHandler();
        var key = Encoding.ASCII.GetBytes(_configuration["Jwt:Key"] ?? throw new InvalidOperationException("JWT key is not configured."));
        var tokenDescriptor = new SecurityTokenDescriptor
        {
            Subject = new ClaimsIdentity(new Claim[]
            {
                new Claim(ClaimTypes.Name, existingUser.Nom),
                new Claim(ClaimTypes.NameIdentifier, existingUser.Id.ToString())
            }),
            Expires = DateTime.UtcNow.AddHours(1),
            SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
        };

        var token = tokenHandler.CreateToken(tokenDescriptor);
        var tokenString = tokenHandler.WriteToken(token);

        return Ok(new { Token = tokenString });
    }
}