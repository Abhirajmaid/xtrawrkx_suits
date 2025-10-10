# Xtrawrkx Suite - Separated Repositories

This directory now serves as a parent directory containing separate, independent repositories for the Xtrawrkx suite of applications.

## Architecture Overview

The Xtrawrkx Suite has been completely separated from a monorepo structure into individual repositories for better maintainability, deployment, and development workflow.

### Repositories Structure

```
xtrawrkx-suits/
├── .github/                    # GitHub workflows and templates
├── xtrawrkx-backend/           # Backend API (Next.js API Routes)
├── xtrawrkx-accounts/          # Accounts Management App
├── xtrawrkx-client-portal/     # Client Portal App
├── xtrawrkx-crm-portal/        # CRM Portal App
├── xtrawrkx-pm-dashboard/      # Project Management Dashboard
├── .gitattributes              # Git attributes configuration
├── .gitignore                  # Git ignore rules
└── README.md                   # This file
```

## Individual Repository Details

### 🔧 Backend API (`xtrawrkx-backend/`)

- **Technology**: Next.js API Routes, Prisma, PostgreSQL
- **Purpose**: Centralized API for all frontend applications
- **Port**: 3004
- **Deployment**: Railway/Vercel
- **Features**: Authentication, User Management, Database Operations

### 👥 Accounts App (`xtrawrkx-accounts/`)

- **Technology**: Next.js, React, Tailwind CSS
- **Purpose**: User account management and authentication
- **Port**: 3003
- **Features**: User registration, profile management, security settings

### 🏢 Client Portal (`xtrawrkx-client-portal/`)

- **Technology**: Next.js, React, Tailwind CSS, MSW (Mock Service Worker)
- **Purpose**: Client-facing portal for project collaboration
- **Port**: 3001
- **Features**: Project tracking, communication, document sharing

### 💼 CRM Portal (`xtrawrkx-crm-portal/`)

- **Technology**: Next.js, React, Tailwind CSS
- **Purpose**: Customer relationship management system
- **Port**: 3002
- **Features**: Lead management, sales pipeline, contact management

### 📊 PM Dashboard (`xtrawrkx-pm-dashboard/`)

- **Technology**: Next.js, React, Tailwind CSS
- **Purpose**: Project management and task tracking
- **Port**: 3000
- **Features**: Task management, project boards, team collaboration

## Development Setup

Each repository is now completely independent. To set up any application:

1. Navigate to the specific repository directory
2. Install dependencies: `npm install`
3. Set up environment variables (see each repo's `.env.example`)
4. Run development server: `npm run dev`

## Deployment

Each repository can be deployed independently:

- **Backend**: Deploy to Railway or Vercel
- **Frontend Apps**: Deploy to Vercel, Netlify, or any static hosting service

## Key Benefits of Separation

✅ **Independent Deployments**: Each app can be deployed separately
✅ **Isolated Dependencies**: No shared dependency conflicts
✅ **Team Autonomy**: Different teams can work on different apps
✅ **Scalability**: Each service can scale independently
✅ **Technology Flexibility**: Each app can use different tech stacks if needed
✅ **Simplified CI/CD**: Separate build and deployment pipelines

## Shared Components

Previously shared UI components have been copied into each application under:

- `src/components/ui/` - Shared UI components
- `src/lib/utils/` - Shared utility functions

This ensures complete independence while maintaining consistency.

## Next Steps

1. Create separate GitHub repositories for each application
2. Set up individual CI/CD pipelines
3. Configure separate deployment environments
4. Update documentation for each repository

## Migration Notes

- All shared dependencies have been localized to each application
- Import statements have been updated to use local components
- Each application has its own `package.json` with standalone dependencies
- No workspace references remain
- Monorepo infrastructure completely removed

## Manual Cleanup (If Needed)

If you encounter a stubborn `node_modules/` directory in the root that cannot be deleted due to file permissions:

```bash
# On Windows (run as Administrator):
takeown /f node_modules /r /d y
icacls node_modules /grant administrators:F /t
rmdir /s /q node_modules

# On macOS/Linux:
sudo rm -rf node_modules
```

---

**Last Updated**: October 2025
**Migration Status**: ✅ Complete
