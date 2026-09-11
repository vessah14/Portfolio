# Guide de déploiement

## Architecture du projet

- **Frontend** : Next.js 16.3.4 avec React 19 et TypeScript
- **Administration** : Next.js 16.3.4 avec React 19 et TypeScript
- **Backend** : .NET 10.0 ASP.NET Core Web API avec PostgreSQL

## Déploiement du backend sur Render

### Variables obligatoires sur Render

- `ASPNETCORE_ENVIRONMENT` : `Production`
- `ConnectionStrings__DefaultConnection` : chaîne PostgreSQL complète
- `Jwt__Key` : clé secrète JWT longue et aléatoire
- `Jwt__Issuer` : `MonApi`
- `Jwt__Audience` : `MonApiUsers`
- `Cloudinary__CloudName`, `Cloudinary__ApiKey`, `Cloudinary__ApiSecret` : identifiants Cloudinary
- `Smtp__Host`, `Smtp__Port`, `Smtp__From`, `Smtp__User`, `Smtp__Password`, `Smtp__NotificationRecipient` : configuration SMTP
- `Cors__AllowedOrigins__0` : origine publique du frontend, par exemple `https://mon-portfolio.example`

Le service Render utilise `backend/Dockerfile` et le fichier [render.yaml](./render.yaml). Le fichier local [backend/appsettings.json](./backend/appsettings.json) n'est pas modifié par le projet et reste ignoré par Git.

### Vérification du backend

- **API actuelle** : `https://portfolio-1-ypt3.onrender.com`
- **Contrôle santé après redeploiement** : `https://portfolio-1-ypt3.onrender.com/health`
- **Swagger en développement** : `https://portfolio-1-ypt3.onrender.com/swagger`

La route `/health` vérifie réellement que l'API peut se connecter à PostgreSQL et renvoie `503` si la base est indisponible.

## Déploiement des frontends

Le frontend public et l'administration peuvent être déployés sur n'importe quel hébergeur compatible avec Next.js. Configurez ces variables au moment du build :

- `NEXT_PUBLIC_API_URL` : `https://portfolio-1-ypt3.onrender.com/api`
- `NEXT_PUBLIC_SITE_URL` : URL publique du frontend public, utilisée pour les métadonnées, le sitemap et les robots

Si `NEXT_PUBLIC_API_URL` est absent, les deux applications utilisent l'URL Render du projet comme valeur de secours. Aucun projet, compétence, statistique, message ou compte ne repose sur des données locales simulées.

## Données et authentification

- Les projets, catégories, compétences, statistiques et messages sont lus depuis l'API.
- Les créations de projets et de compétences utilisent les réponses persistées retournées par l'API, sans identifiant temporaire ni image par défaut.
- L'inscription et la connexion utilisent `/api/User/register` et `/api/User/login`.
- Le dashboard admin utilise le JWT reçu par l'API et vérifie `/health` pour afficher l'état réel du backend.
- Les données du dashboard (visites, notifications ou taux inventés) ne sont pas affichées tant qu'aucun endpoint de base de données ne les fournit.

## Configuration locale du backend

Ne modifiez pas les secrets locaux. Pour une nouvelle installation, copiez [backend/appsettings.Example.json](./backend/appsettings.Example.json) vers `backend/appsettings.json`, puis renseignez vos propres valeurs. Le fichier réel existant doit rester inchangé et ne doit jamais être commit.
