using CloudinaryDotNet;
using CloudinaryDotNet.Actions;

namespace backend.Services
{
    public class CloudinaryService
    {
        private readonly IConfiguration _configuration;
        private Cloudinary? _cloudinary;

        public CloudinaryService(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        public async Task<string> UploadImageAsync(IFormFile file, string folder = "portfolio")
        {
            if (file == null || file.Length == 0)
            {
                throw new ArgumentException("Le fichier est vide.");
            }

            var extension = Path.GetExtension(file.FileName);
            var allowedExtensions = new[] { ".jpg", ".jpeg", ".png", ".webp" };

            if (!allowedExtensions.Contains(extension.ToLowerInvariant()))
            {
                throw new InvalidOperationException("Type de fichier non pris en charge.");
            }

            using var stream = file.OpenReadStream();

            var uploadParams = new ImageUploadParams
            {
                File = new FileDescription(file.FileName, stream),
                Folder = folder,
                UseFilename = true,
                UniqueFilename = true,
                Overwrite = false
            };

            var result = await GetClient().UploadAsync(uploadParams);

            if (result.Error != null)
            {
                throw new InvalidOperationException(result.Error.Message);
            }

            return result.SecureUrl?.ToString()
                ?? throw new InvalidOperationException("L’URL Cloudinary est introuvable.");
        }

        private Cloudinary GetClient()
        {
            if (_cloudinary is not null)
            {
                return _cloudinary;
            }

            var cloudName = _configuration["Cloudinary:CloudName"];
            var apiKey = _configuration["Cloudinary:ApiKey"];
            var apiSecret = _configuration["Cloudinary:ApiSecret"];

            if (string.IsNullOrWhiteSpace(cloudName) ||
                string.IsNullOrWhiteSpace(apiKey) ||
                string.IsNullOrWhiteSpace(apiSecret))
            {
                throw new InvalidOperationException(
                    "Les paramètres Cloudinary (CloudName, ApiKey, ApiSecret) sont requis pour envoyer une image.");
            }

            var account = new Account(cloudName, apiKey, apiSecret);
            _cloudinary = new Cloudinary(account)
            {
                Api = { Secure = true }
            };

            return _cloudinary;
        }
    }
}
