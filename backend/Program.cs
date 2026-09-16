using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Npgsql.EntityFrameworkCore.PostgreSQL;
using backend.Data;
using backend.Services;

var builder = WebApplication.CreateBuilder(args);

var configuredOrigins = builder.Configuration
    .GetSection("Cors:AllowedOrigins")
    .Get<string[]>() ?? [];

if (configuredOrigins.Length == 0)
{
    configuredOrigins = builder.Environment.IsProduction()
        ? ["*"]
        : ["http://localhost:3000", "http://localhost:3001"];
}

var allowAnyOrigin = configuredOrigins.Any(origin => origin == "*");
var allowedOrigins = configuredOrigins
    .Where(origin => !string.IsNullOrWhiteSpace(origin) && origin != "*")
    .ToArray();

if (builder.Environment.IsProduction())
{
    allowedOrigins = allowedOrigins
        .Concat([
            "https://frontend-wheat-two-hh3yzglt50.vercel.app",
            "https://admin-amber-six-49.vercel.app"
        ])
        .Distinct(StringComparer.OrdinalIgnoreCase)
        .ToArray();
}

// Add services to the container.
builder.Services.AddControllers();
builder.Services.AddOpenApi();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddCors(options =>
{
    options.AddPolicy("FrontendPolicy", policy =>
    {
        if (allowAnyOrigin)
        {
            policy.AllowAnyOrigin()
                .AllowAnyHeader()
                .AllowAnyMethod();
        }
        else
        {
            policy.WithOrigins(allowedOrigins)
                .AllowAnyHeader()
                .AllowAnyMethod();
        }
    });
});
var jwtKey = builder.Configuration["Jwt:Key"]
    ?? throw new InvalidOperationException("Jwt:Key is not configured.");

builder.Services
    .AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = builder.Configuration["Jwt:Issuer"],
            ValidAudience = builder.Configuration["Jwt:Audience"],
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.ASCII.GetBytes(jwtKey))
        };
    });
builder.Services.AddAuthorization();

builder.Services.AddSingleton<EmailService>();
builder.Services.AddDbContext<PortfolioDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddScoped<CloudinaryService>();
builder.Services.AddScoped<AdminSeedService>();

var app = builder.Build();

using (var scope = app.Services.CreateScope())
{
    var adminSeedService = scope.ServiceProvider.GetRequiredService<AdminSeedService>();
    await adminSeedService.EnsureAdminAsync();
}

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors("FrontendPolicy");

app.UseAuthentication();
app.UseAuthorization();

app.MapGet("/health", async (PortfolioDbContext db, CancellationToken cancellationToken) =>
{
    try
    {
        var isDatabaseAvailable = await db.Database.CanConnectAsync(cancellationToken);

        return isDatabaseAvailable
            ? Results.Ok(new { status = "ok", database = "connected" })
            : Results.Json(
                new { status = "error", database = "unavailable" },
                statusCode: StatusCodes.Status503ServiceUnavailable);
    }
    catch
    {
        return Results.Json(
            new { status = "error", database = "unavailable" },
            statusCode: StatusCodes.Status503ServiceUnavailable);
    }
});

app.MapControllers();

app.Run();
