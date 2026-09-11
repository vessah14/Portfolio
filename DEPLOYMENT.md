# Guide de Déploiement

## Architecture du projet

- **Frontend**: Next.js 16.3.4 avec React 19 et TypeScript
- **Backend**: .NET 10.0 ASP.NET Core Web API avec PostgreSQL

## Déploiement Backend sur Render

### Prérequis
- Compte Render (https://render.com)
- Base de données PostgreSQL (Supabase ou Render PostgreSQL)
- Repository GitHub avec le code du backend

### Étapes

1. **Configurer les variables d'environnement sur Render**:
   - `ConnectionStrings__DefaultConnection`: Votre chaîne de connexion PostgreSQL
   - `Jwt__Key`: Clé secrète pour JWT (générez une clé sécurisée)
   - `Jwt__Issuer`: "MonApi"
   - `Jwt__Audience`: "MonApiUsers"
   - `Smtp__Host`: Serveur SMTP pour les emails
   - `Smtp__Port`: Port SMTP (ex: 587)
   - `Smtp__From`: Email d'envoi
   - `Smtp__User`: Utilisateur SMTP
   - `Smtp__Password`: Mot de passe SMTP
   - `Smtp__NotificationRecipient`: Email de réception des notifications
   - `Cors__AllowedOrigins__0`: URL de votre frontend Vercel
   - `Cors__AllowedOrigins__1`: URL secondaire si nécessaire

2. **Déployer via render.yaml**:
   - Connectez votre repository GitHub à Render
   - Render détectera automatiquement le fichier `render.yaml`
   - Le déploiement commencera automatiquement

3. **Alternative: Déploiement manuel**:
   - Créez un nouveau "Web Service" sur Render
   - Sélectionnez "Dockerfile"
   - Connectez votre repository
   - Configurez les variables d'environnement
   - Déployez

### Obtenir l'URL du backend
Après déploiement, Render vous fournira une URL comme:
`https://portfolio-backend.onrender.com`

## Déploiement Frontend sur Vercel

### Prérequis
- Compte Vercel (https://vercel.com)
- Repository GitHub avec le code du frontend

### Étapes

1. **Configurer les variables d'environnement sur Vercel**:
   - `NEXT_PUBLIC_API_URL`: URL de votre backend Render
   - Exemple: `https://portfolio-backend.onrender.com`

2. **Déployer**:
   - Connectez votre repository GitHub à Vercel
   - Vercel détectera automatiquement Next.js
   - Configurez les variables d'environnement dans les settings du projet
   - Déployez

### Mettre à jour les CORS sur Render
Après avoir obtenu l'URL Vercel du frontend, mettez à jour les variables d'environnement sur Render:
- `Cors__AllowedOrigins__0`: `https://your-frontend.vercel.app`

## Configuration Cloudinary

Si vous utilisez Cloudinary pour l'upload d'images, ajoutez ces variables d'environnement sur Render:
- `Cloudinary__CloudName`: Votre cloud name Cloudinary
- `Cloudinary__ApiKey`: Votre API key Cloudinary
- `Cloudinary__ApiSecret`: Votre API secret Cloudinary

## Sécurité

- **Ne jamais committer** `appsettings.json` avec des vraies credentials
- Utilisez `appsettings.Example.json` comme template
- Générez des clés JWT fortes et uniques
- Utilisez des secrets GitHub pour les credentials sensibles

## Structure des fichiers créés

- `backend/Dockerfile`: Configuration Docker pour le backend
- `backend/render.yaml`: Configuration Render pour le déploiement
- `backend/.dockerignore`: Fichiers à exclure du build Docker
- `frontend/vercel.json`: Configuration Vercel pour le déploiement

## Test du déploiement

1. Testez l'API backend via Swagger: `https://your-backend.onrender.com/swagger`
2. Testez le frontend: `https://your-frontend.vercel.app`
3. Vérifiez les logs sur Render et Vercel en cas d'erreur
