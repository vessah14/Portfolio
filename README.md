# Portfolio

Application de portfolio composée de trois applications :

- `frontend` : site public Next.js ;
- `Administration/admin` : interface d'administration Next.js ;
- `backend` : API ASP.NET Core avec PostgreSQL, déployée sur Render.

## Configuration de l'API

Les deux applications Next.js utilisent l'API Render via `NEXT_PUBLIC_API_URL` :

```text
NEXT_PUBLIC_API_URL=https://portfolio-1-ypt3.onrender.com/api
```

Le frontend public utilise également `NEXT_PUBLIC_SITE_URL` pour ses métadonnées SEO, son sitemap et ses robots.

## Configuration locale du backend

Les paramètres et identifiants ne doivent jamais être commités. Le fichier `backend/appsettings.json` contient la configuration locale existante et doit rester inchangé. Pour une nouvelle installation, copiez `backend/appsettings.Example.json` vers `backend/appsettings.json`, puis renseignez vos valeurs locales.

Vous pouvez aussi utiliser les User Secrets .NET ou les variables d'environnement Render.

## Vérifications

Depuis la racine du projet :

```bash
npm --prefix frontend run lint
npm --prefix frontend run build
npm --prefix Administration/admin run lint
npm --prefix Administration/admin run build
dotnet build backend/Backend.csproj
```

L'API Render expose `/health` après redéploiement pour vérifier la connexion PostgreSQL.
