# Frontend Firebase Authentication Setup

## Overview

This guide covers setting up Firebase authentication in your accounts app frontend.

## Dependencies

Add Firebase to your accounts app:

```bash
cd apps/accounts
npm install firebase
```

## Environment Variables

Create a `.env.local` file in `apps/accounts/`:

```env
NEXT_PUBLIC_API_URL=http://localhost:3004
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyCRyooUo6KheeDUEuEV9Add_XozmN_p--0
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=xtrawrkx.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=xtrawrkx
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=xtrawrkx.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=647527626177
NEXT_PUBLIC_FIREBASE_APP_ID=1:647527626177:web:6e9bd04cd062e821f9ab40
```

## Usage

### 1. Wrap your app with AuthProvider

```jsx
// In your main App component or layout
import { AuthProvider } from "./hooks/useAuth";

function App({ children }) {
  return <AuthProvider>{children}</AuthProvider>;
}
```

### 2. Use the authentication hook

```jsx
import { useAuth } from "../hooks/useAuth";

function SomeComponent() {
  const { user, isAuthenticated, logout, loading } = useAuth();

  if (loading) return <div>Loading...</div>;

  if (!isAuthenticated) {
    return <LoginComponent />;
  }

  return (
    <div>
      <h1>Welcome, {user.firstName}!</h1>
      <p>Role: {user.role}</p>
      <p>Department: {user.department}</p>
      <button onClick={logout}>Logout</button>
    </div>
  );
}
```

### 3. Use the LoginComponent

```jsx
import LoginComponent from "../components/LoginComponent";

function LoginPage() {
  return <LoginComponent />;
}
```

## Authentication Methods

### 1. Email/Password (Firebase)

- Users register/login with email and password
- Firebase handles authentication
- User data stored in your SQL database

### 2. Phone/OTP (Firebase)

- Users register with phone number
- Firebase sends OTP for verification
- User data stored in your SQL database

### 3. Traditional Login (Internal)

- For existing internal users
- Direct login against your SQL database
- Fallback method for internal employees

## API Integration

The frontend automatically:

1. Authenticates with Firebase
2. Sends Firebase ID token to your backend
3. Receives JWT token for API calls
4. Stores JWT token for subsequent requests
5. Syncs user data between Firebase and SQL database

## Features

- **Automatic token refresh**: Keeps authentication state in sync
- **Persistent login**: Users stay logged in across browser sessions
- **Hybrid authentication**: Supports both Firebase and traditional login
- **Role-based access**: User roles and departments from SQL database
- **Error handling**: Comprehensive error handling for all auth flows

## Firebase Console Setup

Make sure your Firebase project has:

1. **Authentication enabled**
2. **Email/Password provider enabled**
3. **Phone provider enabled** (for OTP)
4. **Authorized domains** configured (localhost, your domain)

## Security Notes

- Firebase ID tokens are verified server-side
- User data is controlled in your SQL database
- JWT tokens are used for API access
- All authentication flows are secure and production-ready
