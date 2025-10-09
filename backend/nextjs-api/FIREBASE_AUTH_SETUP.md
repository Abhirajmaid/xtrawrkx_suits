# Firebase Hybrid Authentication Setup Guide

## Overview

This implementation provides hybrid authentication for XtrawrkxUsers using Firebase for authentication and your SQL database for user data storage.

## Environment Variables

Create a `.env.local` file in the `backend/nextjs-api` directory with the following variables:

```env
# Database
DATABASE_URL="file:./prisma/dev.db"

# JWT
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"

# Firebase Admin SDK Configuration
FIREBASE_PROJECT_ID="xtrawrkx"
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour Firebase private key here (get from service account)\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL="firebase-adminsdk-xxxxx@xtrawrkx.iam.gserviceaccount.com"

# Firebase Web App Config (for frontend)
NEXT_PUBLIC_FIREBASE_API_KEY="AIzaSyCRyooUo6KheeDUEuEV9Add_XozmN_p--0"
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN="xtrawrkx.firebaseapp.com"
NEXT_PUBLIC_FIREBASE_PROJECT_ID="xtrawrkx"
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET="xtrawrkx.firebasestorage.app"
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID="647527626177"
NEXT_PUBLIC_FIREBASE_APP_ID="1:647527626177:web:6e9bd04cd062e821f9ab40"
```

## Setup Steps

1. **Install Dependencies**

   ```bash
   cd backend/nextjs-api
   npm install firebase-admin
   ```

2. **Database Migration**

   ```bash
   npm run db:push
   # or
   npm run db:migrate
   ```

3. **Firebase Project Setup**
   - Create a Firebase project at https://console.firebase.google.com
   - Enable Authentication and configure sign-in methods (Email/Password, Phone)
   - Generate a service account key:
     - Go to Project Settings > Service Accounts
     - Click "Generate new private key"
     - Download the JSON file
     - Extract the values for your environment variables

## Authentication Endpoints

### 1. Firebase Login (Primary)

**POST** `/api/auth/firebase-login`

```json
{
  "idToken": "firebase-id-token",
  "userData": {
    "firstName": "John",
    "lastName": "Doe",
    "role": "DEVELOPER",
    "department": "DEVELOPMENT",
    "hiredDate": "2024-01-01T00:00:00Z"
  }
}
```

### 2. Traditional Login (Backup/Internal)

**POST** `/api/auth/login`

```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

### 3. Send OTP

**POST** `/api/auth/send-otp`

```json
{
  "email": "user@example.com",
  "phone": "+1234567890",
  "firstName": "John",
  "lastName": "Doe",
  "role": "DEVELOPER",
  "department": "DEVELOPMENT"
}
```

### 4. Get Current User

**GET** `/api/auth/me`
Headers: `Authorization: Bearer <firebase-id-token-or-jwt>`

## Authentication Flow

### For New Users (Firebase + OTP):

1. Frontend sends OTP request to `/api/auth/send-otp`
2. User verifies phone number with Firebase
3. Frontend gets Firebase ID token
4. Frontend sends ID token to `/api/auth/firebase-login`
5. Backend creates/updates user in SQL database
6. Backend returns JWT token for API access

### For Existing Users:

1. User logs in with Firebase (frontend)
2. Frontend gets Firebase ID token
3. Frontend sends ID token to `/api/auth/firebase-login`
4. Backend verifies token and returns user data + JWT

### For Internal Users (Fallback):

1. User logs in with email/password to `/api/auth/login`
2. Backend verifies credentials against SQL database
3. Backend returns JWT token

## Database Schema Changes

The `XtrawrkxUser` model now includes:

- `firebaseUid`: Unique Firebase user ID
- `authProvider`: 'PASSWORD', 'FIREBASE', or 'HYBRID'
- `emailVerified`: Email verification status
- `lastLoginAt`: Last login timestamp
- `password`: Optional (null for Firebase-only users)
- `hiredDate`: Optional (for internal employees)

## Middleware

The system uses hybrid middleware that supports both Firebase tokens and JWT tokens:

- `withFirebaseAuth`: Accepts both Firebase ID tokens and JWT tokens
- `withFirebaseAuthOnly`: Only accepts Firebase ID tokens

## Frontend Integration

Your frontend should:

1. Initialize Firebase SDK
2. Handle authentication with Firebase
3. Send Firebase ID tokens to your backend
4. Store returned JWT tokens for API calls
5. Use JWT tokens for subsequent API requests

## Security Considerations

1. Firebase ID tokens are verified server-side
2. User data is stored in your controlled SQL database
3. JWT tokens are generated for API access
4. Hybrid approach allows gradual migration from password to Firebase auth
5. All sensitive operations require valid authentication
