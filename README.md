# Portfolio

Application de portfolio composée de trois applications :

- `frontend` : site public Next.js ;
- `Administration/admin` : interface d'administration Next.js ;
- `backend` : API ASP.NET Core avec PostgreSQL.

## Configuration locale du backend

Les paramètres et identifiants ne doivent jamais être commités. Copiez
`backend/appsettings.Example.json` vers `backend/appsettings.json`, puis renseignez
vos valeurs locales. Vous pouvez aussi utiliser les User Secrets .NET ou des variables
d'environnement.

## Avant un push

Vérifiez les fichiers à envoyer avec `git status`, puis lancez les vérifications propres
à chaque application (par exemple `npm run lint` dans les applications Next.js et
`dotnet build` dans `backend`).
