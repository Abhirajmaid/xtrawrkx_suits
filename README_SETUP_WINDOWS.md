# Xtrawrkx Suite â€” Windows Setup (README)

This README explains how to finish local setup on Windows after running `setup_windows.ps1`.

## Prerequisites (install first)
- Node.js 18+ (LTS) and npm
- Git
- (Optional but recommended) Visual Studio Code
- PostgreSQL installed on Windows OR via WSL (ensure `psql` accessible from PowerShell)
- (Optional) Strapi CLI will be invoked with `npx create-strapi@latest` if you create Strapi project

## Quick steps after running setup_windows.ps1
1. In PowerShell (repo root): `npm install`
2. Create Postgres DB & user (see below) OR run `scripts\bootstrap_local_postgres.ps1` if you have `psql`.
3. Create Strapi project (recommended custom DB option) OR convert existing one:
   - To create new: `npx create-strapi@latest backend/strapi` and choose **Custom -> JavaScript -> Postgres**.
   - To convert: place `backend/strapi/.env` (example shown below) and `backend/strapi/config/database.js` and then `cd backend/strapi && npm install && npm run develop`.
4. Start frontends: `npm --workspace=apps/client-portal run dev` (or use `scripts\dev-all.ps1` to open dev windows).

## Example Strapi .env (do NOT commit):
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_NAME=xtrawrkx
DATABASE_USERNAME=strapi
DATABASE_PASSWORD=strapi
DATABASE_SSL=false

STRAPI_ADMIN_JWT_SECRET=replace_with_a_long_random_string
API_TOKEN_SALT=replace_with_another_random_string

## Notes
- Tailwind config for each app includes \"../../packages/**/*.{js,jsx}\" so shared UI classes are scanned.
- The script does not install Strapi automatically. Create or convert Strapi as described.
