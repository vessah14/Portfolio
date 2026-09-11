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

1. **Déploiement manuel sur Render**:
   - Allez sur Render → New Web Service
   - Sélectionnez "Docker" comme environnement
   - Connectez votre repository GitHub
   - **Root Directory**: `backend`
   - **Dockerfile Path**: `Dockerfile`
   - **Docker Build Context Directory**: (vide)
   - Sélectionnez le plan Free
   - Cliquez sur "Create Web Service"

2. **Configurer les variables d'environnement sur Render**:
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
   - `Cors__AllowedOrigins__0`: URL de votre frontend Vercel (après déploiement)
   - `Cors__AllowedOrigins__1`: URL secondaire si nécessaire

### Backend déployé
- **URL actuelle**: `https://portfolio-1-ypt3.onrender.com`
- **Swagger**: `https://portfolio-1-ypt3.onrender.com/swagger`

## Déploiement Frontend sur Vercel

### Prérequis
- Compte Vercel (https://vercel.com)
- Repository GitHub avec le code du frontend

### Étapes

1. **Déployer**:
   - Connectez votre repository GitHub à Vercel
   - Vercel détectera automatiquement Next.js
   - Configurez la variable d'environnement:
     - `NEXT_PUBLIC_API_URL`: `https://portfolio-1-ypt3.onrender.com/api`
   - Déployez

2. **Mettre à jour les CORS sur Render**:
   - Après avoir obtenu l'URL Vercel du frontend
   - Allez sur Render → Environment Variables
   - Mettez à jour `Cors__AllowedOrigins__0` avec l'URL Vercel
   - Exemple: `https://your-frontend.vercel.app`

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
- `render.yaml`: Configuration Render pour le déploiement (à la racine)
- `backend/.dockerignore`: Fichiers à exclure du build Docker
- `frontend/vercel.json`: Configuration Vercel pour le déploiement

## Modifications effectuées

### Frontend
- Remplacé `http://localhost:5054/api` par `process.env.NEXT_PUBLIC_API_URL || "https://portfolio-1-ypt3.onrender.com/api"` dans:
  - `frontend/about/page.tsx`
  - `frontend/about/components/ContactSection.tsx`
  - `frontend/about/components/RealisationsSection.tsx`
  - `frontend/about/components/SkillsSection.tsx`
- Mis à jour `frontend/vercel.json` avec l'URL du backend

### Backend
- Créé `backend/Dockerfile` pour le conteneur Docker
- Créé `render.yaml` à la racine pour le déploiement Render
- Créé `backend/.dockerignore` pour exclure les fichiers inutiles

## Test du déploiement

1. Testez l'API backend via Swagger: `https://portfolio-1-ypt3.onrender.com/swagger`
2. Testez le frontend: `https://your-frontend.vercel.app`
3. Vérifiez les logs sur Render et Vercel en cas d'erreur
