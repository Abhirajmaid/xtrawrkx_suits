<#
bootstrap_local_postgres.ps1
- Requires psql on PATH
- Runs SQL to create user & DB if not exists and writes backend/strapi/.env
#>

param()
Set-StrictMode -Version Latest
$PG_SUPERUSER = 'postgres'   # adjust if your local superuser is different
$STRAPI_DB = 'xtrawrkx'
$STRAPI_USER = 'strapi'
$STRAPI_PASS = 'strapi'
$STRAPI_DIR = 'backend/strapi'
$ENV_FILE = "$STRAPI_DIR\\.env"

# Check psql
if (-not (Get-Command psql -ErrorAction SilentlyContinue)){
  Write-Error "psql not found on PATH. Install Postgres or ensure psql is available. Aborting."
  exit 2
}

Write-Host "Creating role and database (if not exists) using psql"
$createSql = @"
DO
\$do\$
BEGIN
   IF NOT EXISTS (SELECT FROM pg_roles WHERE rolname = '${STRAPI_USER}') THEN
       CREATE ROLE ${STRAPI_USER} WITH LOGIN PASSWORD '${STRAPI_PASS}';
   END IF;
END
\$do\$;

SELECT 'CREATE DATABASE ${STRAPI_DB}' WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = '${STRAPI_DB}')\gexec

GRANT ALL PRIVILEGES ON DATABASE ${STRAPI_DB} TO ${STRAPI_USER};
"@

# Run as postgres superuser
# On Windows, you may run psql with -U postgres and provide password if set
psql -U $PG_SUPERUSER -c "$createSql"

# Write .env
if (-not (Test-Path $STRAPI_DIR)) { New-Item -ItemType Directory -Force -Path $STRAPI_DIR | Out-Null }
$envContent = @"
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_NAME=${STRAPI_DB}
DATABASE_USERNAME=${STRAPI_USER}
DATABASE_PASSWORD=${STRAPI_PASS}
DATABASE_SSL=false

STRAPI_ADMIN_JWT_SECRET=replace_with_a_long_random_string
API_TOKEN_SALT=replace_with_another_random_string
"@
$envContent | Out-File -FilePath $ENV_FILE -Encoding UTF8 -Force
Write-Host "Wrote $ENV_FILE"
Write-Host "Done. Next: cd $STRAPI_DIR ; npm install ; npm run develop"
