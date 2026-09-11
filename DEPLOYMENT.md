# Guide de déploiement

## Architecture du projet

- **Frontend** : Next.js 16.3.4 avec React 19 et TypeScript
- **Backend** : .NET 10.0 ASP.NET Core Web API avec PostgreSQL

## Déploiement du backend sur Render

### Prérequis

- Compte Render (https://render.com)
- Base de données PostgreSQL (Supabase ou Render PostgreSQL)
- Repository GitHub avec le code du backend

### Étapes

1. **Déploiement manuel sur Render** :
   - Allez sur Render → New Web Service
   - Sélectionnez « Docker » comme environnement
   - Connectez votre repository GitHub
   - **Root Directory** : `backend`
   - **Dockerfile Path** : `Dockerfile`
   - **Docker Build Context Directory** : (vide)
   - Sélectionnez le plan Free
   - Cliquez sur « Create Web Service »

2. **Configurer les variables d'environnement sur Render** :
   - `ConnectionStrings__DefaultConnection` : votre chaîne de connexion PostgreSQL
   - `Jwt__Key` : clé secrète pour JWT (générez une clé sécurisée)
   - `Jwt__Issuer` : `MonApi`
   - `Jwt__Audience` : `MonApiUsers`
   - `Smtp__Host` : serveur SMTP pour les emails
   - `Smtp__Port` : port SMTP (ex. 587)
   - `Smtp__From` : email d'envoi
   - `Smtp__User` : utilisateur SMTP
   - `Smtp__Password` : mot de passe SMTP
   - `Smtp__NotificationRecipient` : email de réception des notifications
   - `Cors__AllowedOrigins__0` : URL publique du frontend après son déploiement
   - `Cors__AllowedOrigins__1` : URL secondaire si nécessaire

### Backend déployé

- **URL actuelle** : `https://portfolio-1-ypt3.onrender.com`
- **Swagger** : `https://portfolio-1-ypt3.onrender.com/swagger`

## Déploiement du frontend

Le frontend Next.js peut être déployé sur n'importe quel hébergeur compatible avec Next.js. Configurez au minimum les variables suivantes dans l'environnement de l'hébergeur choisi :

- `NEXT_PUBLIC_API_URL` : `https://portfolio-1-ypt3.onrender.com/api`
- `NEXT_PUBLIC_SITE_URL` : URL publique du frontend, utilisée par les métadonnées, le sitemap et les robots

Après le déploiement, renseignez l'URL publique du frontend dans `Cors__AllowedOrigins__0` sur Render.

## Configuration Cloudinary

Si vous utilisez Cloudinary pour l'upload d'images, ajoutez ces variables d'environnement sur Render :

- `Cloudinary__CloudName` : votre cloud name Cloudinary
- `Cloudinary__ApiKey` : votre API key Cloudinary
- `Cloudinary__ApiSecret` : votre API secret Cloudinary

## Sécurité

- **Ne jamais committer** `appsettings.json` avec de vraies credentials
- Utilisez `appsettings.Example.json` comme template
- Générez des clés JWT fortes et uniques
- Utilisez les secrets de l'hébergeur pour les credentials sensibles

## Structure des fichiers de déploiement

- `backend/Dockerfile` : configuration Docker pour le backend
- `render.yaml` : configuration Render pour le déploiement à la racine
- `backend/.dockerignore` : fichiers à exclure du build Docker
- `frontend/app/sitemap.ts` : génération du sitemap avec l'URL publique configurée
- `frontend/app/robots.ts` : génération des règles robots avec l'URL publique configurée

## Modifications effectuées

### Frontend

- Utilisation de `NEXT_PUBLIC_API_URL` avec l'API Render comme valeur par défaut dans les composants frontend et d'administration
- Utilisation de `NEXT_PUBLIC_SITE_URL` pour les métadonnées, le sitemap et les robots
- Suppression des fichiers de configuration et des assets de plateforme inutilisés

### Backend

- Création de `backend/Dockerfile` pour le conteneur Docker
- Création de `render.yaml` à la racine pour le déploiement Render
- Création de `backend/.dockerignore` pour exclure les fichiers inutiles

## Test du déploiement

1. Testez l'API backend via Swagger : `https://portfolio-1-ypt3.onrender.com/swagger`
2. Testez le frontend via son URL publique configurée dans `NEXT_PUBLIC_SITE_URL`
3. Vérifiez les logs sur Render et sur l'hébergeur frontend en cas d'erreur
