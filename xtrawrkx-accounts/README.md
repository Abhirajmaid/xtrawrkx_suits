# Xtrawrkx Accounts Management Application

A modern Next.js application for managing user accounts, authentication, and permissions for the Xtrawrkx platform.

## 🚀 Features

- **User Management**: Create, read, update, and delete user accounts
- **Role-Based Access Control (RBAC)**: Granular permissions based on user roles
- **Strapi Authentication**: Secure authentication with JWT tokens via Strapi backend
- **Organization Management**: Manage departments and organizational structure
- **Activity Tracking**: Monitor user activities and system events
- **Settings Management**: Configure application settings and notifications
- **Responsive Design**: Modern UI built with Tailwind CSS and React components

## 📋 Prerequisites

Before deploying, ensure you have:

- Node.js 18.x or higher
- npm or yarn package manager
- A deployed Strapi backend instance (see `xtrawrkx-backend-strapi/`)
- Environment variables configured (see below)

## 🛠️ Installation

### Local Development

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd xtrawrkx-accounts
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Configure environment variables**

   Copy `.env.example` to `.env.local`:

   ```bash
   cp .env.example .env.local
   ```

   Edit `.env.local` and set the required variables:

   ```env
   NEXT_PUBLIC_STRAPI_URL=http://localhost:1337
   NODE_ENV=development
   PORT=3003
   ```

4. **Run the development server**

   ```bash
   npm run dev
   ```

   The application will be available at `http://localhost:3003`

## 🌐 Deployment

### Environment Variables

Configure the following environment variables in your deployment platform:

| Variable                    | Description                    | Required | Example                            |
| --------------------------- | ------------------------------ | -------- | ---------------------------------- |
| `NEXT_PUBLIC_STRAPI_URL`    | URL of your Strapi backend     | Yes      | `https://your-backend.railway.app` |
| `NODE_ENV`                  | Environment mode               | Yes      | `production`                       |
| `PORT`                      | Port for the application       | No       | `3003` (default)                   |
| `NEXT_PUBLIC_DEMO_EMAIL`    | Demo login email (dev only)    | No       | Only for development               |
| `NEXT_PUBLIC_DEMO_PASSWORD` | Demo login password (dev only) | No       | Only for development               |

### Deploy to Railway

[![Deploy on Railway](https://railway.app/button.svg)](https://railway.app/new)

1. **Push your code to GitHub**

   ```bash
   git add .
   git commit -m "Prepare for deployment"
   git push origin main
   ```

2. **Create a new project on Railway**

   - Go to [Railway.app](https://railway.app)
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose your repository

3. **Configure environment variables**

   - Go to your project settings
   - Add the required environment variables (see table above)
   - Ensure `NEXT_PUBLIC_STRAPI_URL` points to your deployed Strapi backend

4. **Deploy**
   - Railway will automatically detect the `railway.json` configuration
   - The build process will start automatically
   - Your app will be available at the generated Railway URL

### Deploy to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

1. **Push your code to GitHub**

2. **Import project in Vercel**

   - Go to [Vercel](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository

3. **Configure project**

   - Framework Preset: `Next.js`
   - Root Directory: `xtrawrkx-accounts`
   - Build Command: `npm run build`
   - Output Directory: `.next`

4. **Set environment variables**

   - Add all required environment variables
   - Ensure `NEXT_PUBLIC_STRAPI_URL` is set to your production backend

5. **Deploy**
   - Click "Deploy"
   - Your app will be live in minutes

## 🏗️ Project Structure

```
xtrawrkx-accounts/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── auth/              # Authentication pages
│   │   ├── users/             # User management
│   │   ├── organization/      # Organization management
│   │   ├── settings/          # Settings pages
│   │   ├── profile/           # User profile
│   │   └── components/        # Layout components
│   ├── components/            # Reusable React components
│   │   ├── ui/               # UI components
│   │   ├── LoginComponent.jsx
│   │   ├── RouteGuard.jsx
│   │   └── withRouteProtection.jsx
│   ├── hooks/                 # Custom React hooks
│   │   ├── useAuth.jsx
│   │   └── usePermissions.jsx
│   ├── lib/                   # Utility libraries
│   │   ├── api.js            # API client
│   │   ├── auth.js           # Auth utilities
│   │   ├── authService.js    # Auth service
│   │   ├── permissionsService.js
│   │   └── strapiClient.js   # Strapi client
│   └── middleware.js          # Next.js middleware
├── public/                    # Static assets
├── .env.example              # Environment variables template
├── .gitignore                # Git ignore rules
├── next.config.js            # Next.js configuration
├── package.json              # Dependencies
├── railway.json              # Railway deployment config
├── vercel.json               # Vercel deployment config
└── tailwind.config.js        # Tailwind CSS configuration
```

## 🔒 Security Considerations

### Production Deployment

1. **Environment Variables**

   - Never commit `.env` files to version control
   - Use secure environment variable management in your deployment platform
   - Rotate credentials regularly

2. **Auto-login**

   - Auto-login is **disabled** in production (`NODE_ENV=production`)
   - Only enable demo credentials in development environments
   - Never use `NEXT_PUBLIC_DEMO_EMAIL` and `NEXT_PUBLIC_DEMO_PASSWORD` in production

3. **HTTPS**

   - Always use HTTPS in production
   - Most deployment platforms (Railway, Vercel) provide SSL automatically

4. **Backend Security**
   - Ensure your Strapi backend is properly secured
   - Use CORS configuration to restrict access
   - Enable rate limiting to prevent abuse

## 🧪 Testing

Run the test suite:

```bash
npm test
```

Run linting:

```bash
npm run lint
```

## 📦 Building for Production

Build the application:

```bash
npm run build
```

Start the production server:

```bash
npm start
```

The application will run on port 3003 by default.

## 🔧 Configuration

### Next.js Configuration

The `next.config.js` file includes:

- API rewrites to proxy requests to Strapi
- Environment variable configuration
- Transpile packages configuration

### Middleware

The application uses Next.js middleware for:

- Route protection
- Authentication checks
- Permission validation

## 📚 API Integration

This application integrates with the Xtrawrkx Strapi backend:

- **Authentication**: `/api/auth/*`
- **Users**: `/api/xtrawrkx-users`
- **Roles**: `/api/user-roles`
- **Dashboard**: `/api/dashboard/*`

Ensure your Strapi backend is configured with the matching API endpoints.

## 🤝 Contributing

1. Create a feature branch
2. Make your changes
3. Run tests and linting
4. Submit a pull request

## 📝 License

MIT License - see LICENSE file for details

## 🆘 Support

For issues and questions:

- Check the documentation in `xtrawrkx-backend-strapi/`
- Review environment variables configuration
- Check Strapi backend connectivity
- Verify authentication is working properly

## 🔗 Related Documentation

- [Firebase Frontend Setup](./FIREBASE_FRONTEND_SETUP.md)
- [Strapi Backend Setup](../xtrawrkx-backend-strapi/STRAPI_SETUP.md)
- [Authentication Migration](../AUTHENTICATION_MIGRATION.md)
- [Firebase-Strapi Integration](../FIREBASE_STRAPI_INTEGRATION.md)
