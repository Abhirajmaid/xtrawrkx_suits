# Xtrawrkx Suite

A comprehensive business management suite built with Next.js, Strapi, and modern web technologies. The suite consists of multiple applications for CRM, client portal, project management, and more.

## 🚀 Overview

Xtrawrkx Suite is a monorepo-based application suite designed to handle various business operations:

- **CRM Portal** - Customer relationship management with sales, leads, and account management
- **Client Portal** - Client-facing interface for project collaboration and communication
- **PM Dashboard** - Project management dashboard for tracking tasks and project progress
- **Strapi Backend** - Headless CMS and API backend for data management

## 🏗️ Architecture

This project uses a monorepo structure powered by:

- **Turbo** - Build system and task runner for monorepos
- **Next.js 14** - React framework for all frontend applications
- **Strapi 5** - Headless CMS and API backend
- **Tailwind CSS** - Utility-first CSS framework
- **Shared Packages** - Reusable UI components and utilities

## 📁 Project Structure

```
xtrawrkx_suits/
├── apps/                          # Frontend applications
│   ├── crm-portal/               # CRM application (Port: 3001)
│   │   ├── src/
│   │   │   ├── app/              # Next.js App Router pages
│   │   │   │   ├── sales/        # Sales module (leads, deals, accounts)
│   │   │   │   └── delivery/     # Delivery module (projects)
│   │   │   ├── components/       # React components
│   │   │   ├── lib/              # Utilities and configurations
│   │   │   └── styles/           # Global styles
│   │   ├── next.config.js
│   │   ├── tailwind.config.js
│   │   └── package.json
│   ├── client-portal/            # Client-facing portal (Port: 3002)
│   │   ├── src/
│   │   │   ├── app/              # Next.js App Router pages
│   │   │   ├── components/       # React components
│   │   │   └── styles/           # Global styles
│   │   └── package.json
│   └── pm-dashboard/             # Project management dashboard (Port: 3003)
│       ├── src/
│       │   ├── app/
│       │   │   ├── projects/     # Project management pages
│       │   │   └── my-task/      # Task management pages
│       │   ├── components/       # React components
│       │   └── styles/           # Global styles
│       └── package.json
├── backend/                      # Backend services
│   └── strapi/                   # Strapi CMS (Port: 1337)
│       ├── config/               # Strapi configuration
│       ├── src/
│       │   ├── api/              # API routes and controllers
│       │   ├── admin/            # Admin panel customizations
│       │   └── extensions/       # Strapi extensions
│       ├── database/             # Database migrations
│       └── package.json
├── packages/                     # Shared packages
│   ├── ui/                       # Shared UI components
│   │   └── src/
│   │       ├── AreaChart.jsx     # Chart components
│   │       ├── Avatar.jsx        # User interface components
│   │       ├── Button.jsx        # Form components
│   │       ├── Card.jsx          # Layout components
│   │       ├── Table.jsx         # Data display components
│   │       └── index.js          # Package exports
│   └── utils/                    # Shared utilities
├── infra/                        # Infrastructure and deployment
│   ├── docker/                   # Docker configurations
│   ├── k8s/                      # Kubernetes manifests
│   └── db/                       # Database scripts
├── scripts/                      # Development and deployment scripts
│   ├── dev-all.ps1              # Start all dev servers (Windows)
│   └── bootstrap_local_postgres.ps1  # PostgreSQL setup
├── turbo.json                    # Turbo configuration
├── package.json                  # Root package.json with workspaces
└── README.md                     # This file
```

## 🛠️ Prerequisites

Before setting up the project, ensure you have the following installed:

### Required

- **Node.js 18+** (LTS recommended)
- **npm** (comes with Node.js)
- **Git**
- **PostgreSQL** (for Strapi backend)

### Recommended

- **Visual Studio Code** (with recommended extensions)
- **PostgreSQL client** (pgAdmin, DBeaver, or CLI tools)

## ⚡ Quick Start

### 1. Clone and Install

```bash
# Clone the repository
git clone <repository-url>
cd xtrawrkx_suits

# Install all dependencies
npm install
```

### 2. Database Setup

#### Option A: Automated Setup (Windows)

```powershell
# Run the PostgreSQL bootstrap script
.\scripts\bootstrap_local_postgres.ps1
```

#### Option B: Manual Setup

```sql
-- Connect to PostgreSQL and create database and user
CREATE DATABASE xtrawrkx;
CREATE USER strapi WITH ENCRYPTED PASSWORD 'strapi';
GRANT ALL PRIVILEGES ON DATABASE xtrawrkx TO strapi;
```

### 3. Backend Setup (Strapi)

```bash
# Navigate to Strapi directory
cd backend/strapi

# Create environment file
cp .env.example .env
# Edit .env with your database credentials

# Install dependencies and start
npm install
npm run develop
```

**Strapi Environment Configuration** (`.env`):

```env
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_NAME=xtrawrkx
DATABASE_USERNAME=strapi
DATABASE_PASSWORD=strapi
DATABASE_SSL=false

STRAPI_ADMIN_JWT_SECRET=your_jwt_secret_here
API_TOKEN_SALT=your_api_token_salt_here
```

### 4. Start Frontend Applications

#### Option A: Start All Apps (Windows)

```powershell
# Start all frontend apps in separate windows
.\scripts\dev-all.ps1
```

#### Option B: Start Individual Apps

```bash
# Start CRM Portal (http://localhost:3001)
npm --workspace=apps/crm-portal run dev

# Start Client Portal (http://localhost:3002)
npm --workspace=apps/client-portal run dev

# Start PM Dashboard (http://localhost:3003)
npm --workspace=apps/pm-dashboard run dev
```

#### Option C: Start All Apps with Turbo

```bash
# Start all apps simultaneously
npm run dev
```

## 🔧 Development Workflow

### Available Scripts

```bash
# Development
npm run dev          # Start all apps in development mode
npm run build        # Build all applications
npm run lint         # Lint all applications
npm run test         # Run tests for all applications

# Individual workspace commands
npm --workspace=apps/crm-portal run dev
npm --workspace=apps/client-portal run dev
npm --workspace=apps/pm-dashboard run dev
npm --workspace=backend/strapi run develop
```

### Working with Shared Packages

The project includes shared packages for common functionality:

- **`@xtrawrkx/ui`** - Shared React components (buttons, charts, forms, etc.)
- **`@xtrawrkx/utils`** - Common utility functions

To add a new shared component:

1. Create the component in `packages/ui/src/`
2. Export it in `packages/ui/src/index.js`
3. Use it in any app: `import { ComponentName } from '@xtrawrkx/ui'`

### Adding New Dependencies

```bash
# Add to specific workspace
npm --workspace=apps/crm-portal install package-name

# Add to shared package
npm --workspace=packages/ui install package-name

# Add to root (affects all workspaces)
npm install package-name
```

## 🌐 Application URLs

When running in development mode:

- **CRM Portal**: http://localhost:3001
- **Client Portal**: http://localhost:3002
- **PM Dashboard**: http://localhost:3003
- **Strapi Admin**: http://localhost:1337/admin
- **Strapi API**: http://localhost:1337/api

## 🎨 UI Components

The `@xtrawrkx/ui` package provides a comprehensive set of reusable components:

### Charts

- `AreaChart`, `BarChart`, `LineChart`, `PieChart` - Data visualization components

### UI Elements

- `Button`, `Input`, `Select`, `Checkbox` - Form components
- `Card`, `Modal`, `Container` - Layout components
- `Avatar`, `Badge`, `StatCard` - Display components
- `Table`, `Tabs` - Data organization components

### Usage Example

```jsx
import { Button, Card, AreaChart } from "@xtrawrkx/ui";

function Dashboard() {
  return (
    <Card>
      <AreaChart data={chartData} />
      <Button variant="primary">Save Changes</Button>
    </Card>
  );
}
```

## 🚀 Deployment

### Environment Setup

Each application requires environment configuration:

#### Frontend Apps (.env.local)

```env
NEXT_PUBLIC_STRAPI_URL=http://localhost:1337
NEXT_PUBLIC_APP_ENV=development
```

#### Strapi (.env)

```env
DATABASE_HOST=your_db_host
DATABASE_PORT=5432
DATABASE_NAME=your_db_name
DATABASE_USERNAME=your_db_user
DATABASE_PASSWORD=your_db_password
DATABASE_SSL=true

STRAPI_ADMIN_JWT_SECRET=your_production_jwt_secret
API_TOKEN_SALT=your_production_api_token_salt
```

### Build for Production

```bash
# Build all applications
npm run build

# Build specific application
npm --workspace=apps/crm-portal run build
```

### Docker Deployment

The project includes Docker configurations in the `infra/docker/` directory.

```bash
# Build and run with Docker Compose
docker-compose up --build
```

## 🧪 Testing

```bash
# Run all tests
npm run test

# Run tests for specific workspace
npm --workspace=apps/crm-portal run test
```

## 📝 Code Style

The project uses:

- **ESLint** - JavaScript/React linting
- **Prettier** - Code formatting
- **Tailwind CSS** - Utility-first styling

### Recommended VS Code Extensions

- ES7+ React/Redux/React-Native snippets
- Tailwind CSS IntelliSense
- ESLint
- Prettier - Code formatter

## 🔍 Troubleshooting

### Common Issues

#### 1. Database Connection Issues

```bash
# Check PostgreSQL service status
pg_ctl status

# Test connection
psql -h localhost -U strapi -d xtrawrkx
```

#### 2. Port Conflicts

If ports are already in use, update the port numbers in respective `package.json` files:

- CRM Portal: `"dev": "next dev -p 3001"`
- Client Portal: `"dev": "next dev -p 3002"`
- PM Dashboard: `"dev": "next dev -p 3003"`

#### 3. Node Modules Issues

```bash
# Clean install
rm -rf node_modules package-lock.json
npm install

# Clean workspace node_modules
npx turbo clean
npm install
```

#### 4. Turbo Cache Issues

```bash
# Clear Turbo cache
npx turbo clean
```

## 🤝 Contributing

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (`git commit -m 'Add amazing feature'`)
4. **Push** to the branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

### Development Guidelines

- Follow the existing code style and conventions
- Write meaningful commit messages
- Add tests for new features
- Update documentation as needed
- Use TypeScript where applicable

## 📊 Tech Stack

### Frontend

- **Next.js 14** - React framework with App Router
- **React 18** - UI library
- **Tailwind CSS** - Styling
- **Headless UI** - Accessible UI components
- **Framer Motion** - Animations
- **Lucide React** - Icons
- **Recharts** - Data visualization

### Backend

- **Strapi 5** - Headless CMS
- **PostgreSQL** - Database
- **Node.js** - Runtime environment

### Development Tools

- **Turbo** - Monorepo build system
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **Autoprefixer** - CSS post-processing

## 📄 License

This project is proprietary and confidential. All rights reserved.

## 📞 Support

For support and questions:

- Create an issue in the repository
- Contact the development team
- Check the troubleshooting section above

---

**Happy coding! 🎉**
