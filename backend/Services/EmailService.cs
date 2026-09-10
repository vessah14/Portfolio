using MailKit.Net.Smtp;
using MailKit.Security;
using MimeKit;

public class EmailService
{
    private readonly IConfiguration _config;

    public EmailService(IConfiguration config) => _config = config;

    public async Task SendEmailAsync(string to, string subject, string htmlBody)
    {
        var host = Required("Smtp:Host");
        var from = Required("Smtp:From");
        var user = Required("Smtp:User");
        var password = Required("Smtp:Password");
        var portValue = Required("Smtp:Port");

        if (!int.TryParse(portValue, out var port) || port is < 1 or > 65535)
        {
            throw new InvalidOperationException("La configuration Smtp:Port est invalide.");
        }

        var message = new MimeMessage();
        message.From.Add(new MailboxAddress("Mon Portfolio", from));
        message.To.Add(new MailboxAddress("", to));
        message.Subject = subject;
        message.Body = new TextPart("html") { Text = htmlBody };

        using var client = new SmtpClient();
        await client.ConnectAsync(host, port, SecureSocketOptions.StartTls);

        await client.AuthenticateAsync(user, password);
        await client.SendAsync(message);
        await client.DisconnectAsync(true);
    }

    private string Required(string key) =>
        _config[key] ?? throw new InvalidOperationException($"La configuration {key} est requise.");
}
