# How to Get Firebase Service Account Credentials

## Overview

You need Firebase Admin SDK credentials for your backend to verify Firebase tokens and manage users.

## Step-by-Step Guide

### 1. Go to Firebase Console

Visit: https://console.firebase.google.com/project/xtrawrkx

### 2. Navigate to Project Settings

- Click the **gear icon** ⚙️ in the top left
- Select **"Project settings"**

### 3. Go to Service Accounts Tab

- In Project Settings, click the **"Service accounts"** tab
- You should see "Firebase Admin SDK" section

### 4. Generate New Private Key

- Click **"Generate new private key"** button
- A dialog will appear warning about keeping the key secure
- Click **"Generate key"**

### 5. Download the JSON File

- A JSON file will be downloaded (e.g., `xtrawrkx-firebase-adminsdk-xxxxx.json`)
- **Keep this file secure** - never commit it to version control!

### 6. Extract the Required Values

Open the downloaded JSON file and extract these values:

```json
{
  "type": "service_account",
  "project_id": "xtrawrkx",
  "private_key_id": "...",
  "private_key": "-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n",
  "client_email": "firebase-adminsdk-xxxxx@xtrawrkx.iam.gserviceaccount.com",
  "client_id": "...",
  "auth_uri": "...",
  "token_uri": "...",
  "auth_provider_x509_cert_url": "...",
  "client_x509_cert_url": "..."
}
```

### 7. Add to Your Environment Variables

Create `.env.local` in `backend/nextjs-api/`:

```env
# Database
DATABASE_URL="file:./prisma/dev.db"

# JWT
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"

# Firebase Admin SDK Configuration
FIREBASE_PROJECT_ID="xtrawrkx"
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour actual private key from the JSON file\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL="firebase-adminsdk-xxxxx@xtrawrkx.iam.gserviceaccount.com"

# Firebase Web App Config (for frontend)
NEXT_PUBLIC_FIREBASE_API_KEY="AIzaSyCRyooUo6KheeDUEuEV9Add_XozmN_p--0"
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN="xtrawrkx.firebaseapp.com"
NEXT_PUBLIC_FIREBASE_PROJECT_ID="xtrawrkx"
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET="xtrawrkx.firebasestorage.app"
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID="647527626177"
NEXT_PUBLIC_FIREBASE_APP_ID="1:647527626177:web:6e9bd04cd062e821f9ab40"
```

## Important Notes

### ⚠️ Security Warning

- **Never commit the service account JSON file to Git**
- **Never share the private key publicly**
- Add `*.json` and `.env*` to your `.gitignore`

### 📝 Private Key Format

The private key in the JSON file will have `\n` characters that need to be preserved. When copying to your `.env.local`, make sure to:

- Keep the `-----BEGIN PRIVATE KEY-----` and `-----END PRIVATE KEY-----` lines
- Preserve all `\n` characters (they represent newlines)

### 🔄 Alternative: Using the JSON File Directly

Instead of individual environment variables, you can also use the entire JSON file:

```env
GOOGLE_APPLICATION_CREDENTIALS="path/to/your/service-account-file.json"
```

But for security and deployment flexibility, individual environment variables are recommended.

## Verification

After setting up the credentials, your backend should be able to:

1. Verify Firebase ID tokens
2. Create/update users in your SQL database
3. Handle hybrid authentication flows

## Troubleshooting

### Common Issues:

1. **"Invalid private key"** - Check that the private key format is correct with proper newlines
2. **"Project not found"** - Verify the project ID matches your Firebase project
3. **"Permission denied"** - Ensure the service account has proper permissions

### Test Your Setup:

You can test if your credentials work by starting your backend server and checking the logs for any Firebase initialization errors.

## Next Steps

Once you have the credentials set up:

1. Install Firebase Admin SDK: `npm install firebase-admin`
2. Run database migration: `npm run db:push`
3. Start your backend: `npm run dev:server`
4. Test authentication endpoints
