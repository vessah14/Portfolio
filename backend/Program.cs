using Microsoft.EntityFrameworkCore;
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
builder.Services.AddSingleton<EmailService>();
builder.Services.AddDbContext<PortfolioDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddScoped<CloudinaryService>();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors("FrontendPolicy");

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
