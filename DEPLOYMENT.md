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
- `AdminSeed__Enabled` : `true` pour créer le compte administrateur initial au démarrage
- `AdminSeed__Nom` : `VNAtech`
- `AdminSeed__Prenom` : `Administrateur`
- `AdminSeed__Email` : `admin@vnatech.com`
- `AdminSeed__Password` : mot de passe fort, défini comme secret Render et jamais commit
- `Cors__AllowedOrigins__0` : `https://frontend-wheat-two-hh3yzglt50.vercel.app`
- `Cors__AllowedOrigins__1` : `https://admin-amber-six-49.vercel.app`

Le service Render utilise `backend/Dockerfile` et le fichier [render.yaml](./render.yaml). Le fichier local [backend/appsettings.json](./backend/appsettings.json) n'est pas modifié par le projet et reste ignoré par Git.

### Compte administrateur initial

Lorsque `AdminSeed__Enabled=true`, le backend crée au premier démarrage un compte dans la table PostgreSQL `Administrateur` avec les valeurs `AdminSeed__Nom`, `AdminSeed__Prenom`, `AdminSeed__Email` et `AdminSeed__Password`. Le mot de passe est haché avec BCrypt avant d'être enregistré.

Le seed est idempotent : si l'adresse existe déjà, le mot de passe existant n'est jamais remplacé. Pour créer un nouveau compte initial, utilisez une nouvelle adresse ou appelez `/api/User/register` avec un jeton admin valide. Après avoir renseigné `AdminSeed__Password` dans Render, redémarrez le service backend afin d'exécuter le seed.

Identifiants par défaut configurés dans `render.yaml` :

- **Email** : `admin@vnatech.com`
- **Mot de passe** : la valeur secrète définie dans `AdminSeed__Password` sur Render

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

### URLs actuellement publiées

- **Frontend public sur Vercel** : `https://frontend-wheat-two-hh3yzglt50.vercel.app`
- **Administration sur Vercel** : `https://admin-amber-six-49.vercel.app`
- **API backend sur Render** : `https://portfolio-1-ypt3.onrender.com`

Les variables Vercel utilisées pour les deux projets sont :

- `NEXT_PUBLIC_API_URL` : `https://portfolio-1-ypt3.onrender.com/api`
- `NEXT_PUBLIC_SITE_URL` : `https://frontend-wheat-two-hh3yzglt50.vercel.app` pour le frontend public

## Données et authentification

- Les projets, catégories, compétences, statistiques et messages sont lus depuis l'API.
- Les créations de projets et de compétences utilisent les réponses persistées retournées par l'API, sans identifiant temporaire ni image par défaut.
- Le frontend public n'a pas de compte visiteur : il n'expose ni inscription ni connexion, et se limite à la lecture publique des projets/compétences/catégories et à l'envoi du formulaire de contact.
- L'interface admin affiche un formulaire de connexion sur `/`. Les pages `/dashboard`, `/projects`, `/skills`, `/activity` et `/messages` sont protégées par `AdminAuthGuard` et redirigent vers `/` si aucun jeton valide n'est présent en session. La route `/signup` redirige vers `/`.
- Le jeton JWT est obtenu via `/api/User/login`, stocké en `sessionStorage` et envoyé en en-tête `Authorization: Bearer` par `apiFetch` sur chaque appel API.
- Côté backend, `/api/User/register`, la création/modification/suppression des projets et compétences, l'upload d'images et la lecture/modification/suppression des messages exigent ce jeton (`[Authorize]`). Seuls la lecture publique des projets/compétences/catégories, `/api/User/login` et l'envoi d'un message de contact restent anonymes.
- Les données du dashboard (visites, notifications ou taux inventés) ne sont pas affichées tant qu'aucun endpoint de base de données ne les fournit.

## Configuration locale du backend

Ne modifiez pas les secrets locaux. Pour une nouvelle installation, copiez [backend/appsettings.Example.json](./backend/appsettings.Example.json) vers `backend/appsettings.json`, puis renseignez vos propres valeurs. Le fichier réel existant doit rester inchangé et ne doit jamais être commit.
