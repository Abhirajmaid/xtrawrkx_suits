# Strapi Environment Setup

This guide explains how to run Strapi in both development and production environments.

## Quick Start

### Development (Local)

```bash
# Switch to development environment and start
npm run dev:local

# Or manually:
npm run setup:dev
npm run develop
```

### Production (Railway)

```bash
# Switch to production environment and start
npm run start:prod

# Or manually:
npm run setup:prod
npm run start
```

## Environment Files

- `.env.development` - Local development configuration
- `.env.production` - Railway production configuration
- `.env` - Active environment (created by setup scripts)

## Available Scripts

| Script               | Description                                            |
| -------------------- | ------------------------------------------------------ |
| `npm run dev:local`  | Switch to dev environment and start development server |
| `npm run start:prod` | Switch to prod environment and start production server |
| `npm run setup:dev`  | Switch to development environment only                 |
| `npm run setup:prod` | Switch to production environment only                  |
| `npm run env:check`  | Check current environment                              |
| `npm run develop`    | Start development server (uses current .env)           |
| `npm run start`      | Start production server (uses current .env)            |

## Development Setup

### Prerequisites

1. **PostgreSQL** running locally
2. **Node.js** 18+ installed

### Database Setup

Create a local PostgreSQL database:

```sql
CREATE DATABASE xtrawrkx_strapi_dev;
```

### Start Development

```bash
npm run dev:local
```

Access:

- **Admin Panel**: http://localhost:1337/admin
- **API**: http://localhost:1337/api

## Production Setup

### Prerequisites

1. **Railway** account and project
2. **PostgreSQL** database on Railway

### Environment Variables

Update `.env.production` with your Railway database credentials:

- `DATABASE_URL`
- `DATABASE_HOST`
- `DATABASE_USERNAME`
- `DATABASE_PASSWORD`

### Deploy

```bash
npm run start:prod
```

## Troubleshooting

### Database Connection Issues

- **Development**: Ensure PostgreSQL is running locally
- **Production**: Check Railway database credentials

### Port Issues

- Default port is 1337
- Change `PORT` in environment file if needed

### Environment Not Switching

- Check if `.env` file exists
- Run `npm run env:check` to verify current environment

## Configuration Details

### Development Environment

- Uses local PostgreSQL database
- SSL disabled
- Simple application keys (for development only)
- Localhost URL

### Production Environment

- Uses Railway PostgreSQL database
- SSL enabled
- Strong application keys (should be changed for security)
- Railway URL

## Security Notes

⚠️ **Important**:

- Change all application keys in production
- Use strong, unique passwords
- Never commit `.env` files to version control
- Use environment variables for sensitive data in production
