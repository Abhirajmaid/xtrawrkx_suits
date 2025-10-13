# Firebase Auth + Strapi Integration Setup

This guide will help you set up Firebase authentication with Strapi data storage for both the accounts page and client portal onboarding process.

## Overview

The integration works as follows:

- **Firebase Auth**: Handles user authentication (email/password, phone, etc.)
- **Strapi CMS**: Stores user data, onboarding information, and application data
- **Accounts Page**: Uses Firebase auth + Strapi for user management
- **Client Portal**: Uses Firebase auth + Strapi for onboarding data storage

## Setup Steps

### 1. Firebase Configuration

1. **Create Firebase Project**:

   - Go to [Firebase Console](https://console.firebase.google.com/)
   - Create a new project or use existing one
   - Enable Authentication with Email/Password and Phone providers

2. **Generate Service Account Key**:

   - Go to Project Settings > Service Accounts
   - Generate new private key (JSON file)
   - Save the JSON file securely

3. **Configure Environment Variables**:
   Create `.env` file in `xtrawrkx-backend-strapi/` with:
   ```env
   FIREBASE_PROJECT_ID=your-project-id
   FIREBASE_PRIVATE_KEY_ID=your-private-key-id
   FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYOUR_PRIVATE_KEY\n-----END PRIVATE KEY-----\n"
   FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your-project-id.iam.gserviceaccount.com
   FIREBASE_CLIENT_ID=your-client-id
   FIREBASE_CLIENT_X509_CERT_URL=https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-xxxxx%40your-project-id.iam.gserviceaccount.com
   ```

### 2. Strapi Backend Setup

1. **Install Dependencies**:

   ```bash
   cd xtrawrkx-backend-strapi
   npm install firebase-admin
   ```

2. **Database Setup**:

   ```bash
   # Create PostgreSQL database
   createdb xtrawrkx_strapi

   # Run Strapi development server (will create tables)
   npm run develop
   ```

3. **Create Admin User**:
   - Access http://localhost:1337/admin
   - Create your first admin user

### 3. Accounts Page Configuration

1. **Environment Variables**:
   Create `.env.local` in `xtrawrkx-accounts/`:

   ```env
   NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
   NEXT_PUBLIC_STRAPI_URL=http://localhost:1337
   ```

2. **Firebase Web Config**:
   Update `xtrawrkx-accounts/src/lib/firebase.js` with your Firebase config

### 4. Client Portal Configuration

1. **Environment Variables**:
   Create `.env.local` in `xtrawrkx-client-portal/`:

   ```env
   NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
   NEXT_PUBLIC_STRAPI_URL=http://localhost:1337
   NEXT_PUBLIC_USE_STRAPI=true
   ```

2. **Firebase Web Config**:
   Update client portal Firebase configuration

### 5. Testing the Integration

1. **Start Strapi Backend**:

   ```bash
   cd xtrawrkx-backend-strapi
   npm run develop
   ```

2. **Start Accounts Page**:

   ```bash
   cd xtrawrkx-accounts
   npm run dev
   ```

3. **Start Client Portal**:

   ```bash
   cd xtrawrkx-client-portal
   npm run dev
   ```

4. **Test Flow**:
   - Register new user in accounts page
   - Verify user appears in Strapi admin
   - Test onboarding flow in client portal
   - Verify onboarding data is saved to Strapi

## Data Flow

### Accounts Page

1. User registers/logs in via Firebase Auth
2. Firebase token is sent to Strapi
3. Strapi middleware verifies token and creates/updates user
4. User data stored in `xtrawrkx_users` collection

### Client Portal Onboarding

1. User authenticates via Firebase
2. Onboarding data sent to Strapi with Firebase token
3. Data stored in user record with onboarding fields
4. Community applications stored as separate records

## Troubleshooting

### Common Issues

1. **Firebase Token Errors**:

   - Check Firebase service account configuration
   - Verify environment variables are set correctly
   - Ensure private key format is correct (with \n newlines)

2. **Strapi Connection Issues**:

   - Verify Strapi is running on correct port
   - Check database connection
   - Verify API endpoints are accessible

3. **CORS Issues**:
   - Update Strapi CORS configuration
   - Add client domains to allowed origins

### Debug Mode

Enable debug logging by setting:

```env
NODE_ENV=development
DEBUG=strapi:*
```

## Next Steps

1. **Production Deployment**:

   - Set up production Firebase project
   - Configure production Strapi instance
   - Update environment variables for production

2. **Additional Features**:

   - Add role-based permissions
   - Implement user management features
   - Add audit logging

3. **Security Enhancements**:
   - Implement rate limiting
   - Add input validation
   - Set up monitoring and alerts



