# 🚀 Xtrawrkx Backend API - Production Deployment Guide

This guide covers all the pre-deployment setup tasks and production deployment steps for the Xtrawrkx Backend API.

## ✅ Pre-Deployment Checklist

### 1. ✅ Database Configuration (PostgreSQL)

- [x] Updated Prisma schema to use PostgreSQL
- [x] Environment variable `DATABASE_URL` configured for PostgreSQL

**Action Required:**

```bash
# Set your PostgreSQL connection string
DATABASE_URL="postgresql://username:password@host:port/database?schema=public"
```

### 2. ✅ Firebase Admin SDK Setup

- [x] Environment variables configured for Firebase Admin SDK
- [x] Removed hardcoded credentials from code

**Action Required:**

1. Get Firebase service account credentials from [Firebase Console](https://console.firebase.google.com/project/xtrawrkx)
2. Set these environment variables:

```bash
FIREBASE_PROJECT_ID="xtrawrkx"
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL="firebase-adminsdk-xxxxx@xtrawrkx.iam.gserviceaccount.com"
```

### 3. ✅ CORS Configuration

- [x] Created centralized CORS configuration
- [x] Environment-based allowed origins
- [x] Updated API routes to use new CORS system

**Action Required:**

```bash
# Set allowed origins for production
ALLOWED_ORIGINS="https://yourdomain.com,https://accounts.yourdomain.com,https://crm.yourdomain.com,https://pm.yourdomain.com,https://client-portal.yourdomain.com"
```

### 4. ✅ SMTP Email Configuration

- [x] Created email service with SMTP support
- [x] Email templates for welcome, password reset, OTP
- [x] Email testing endpoint

**Action Required:**

```bash
# SMTP Configuration
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_SECURE="false"
SMTP_USER="your-email@gmail.com"
SMTP_PASS="your-app-password"
FROM_EMAIL="noreply@yourdomain.com"
FROM_NAME="Xtrawrkx"
```

### 5. ✅ Security Secrets

- [x] JWT secret using environment variables
- [x] Secret generation script created

**Action Required:**

```bash
# Generate secrets using the provided script
node scripts/generate-secrets.js

# Or manually set strong secrets (minimum 32 characters)
JWT_SECRET="your-super-secret-jwt-key-minimum-32-characters"
NEXTAUTH_SECRET="your-nextauth-secret-minimum-32-characters"
```

## 📋 Complete Environment Configuration

Create a `.env` file in `backend/nextjs-api/` with these variables:

```bash
# =================================
# DATABASE CONFIGURATION
# =================================
DATABASE_URL="postgresql://username:password@host:port/database?schema=public"

# =================================
# AUTHENTICATION & SECURITY
# =================================
JWT_SECRET="your-super-secret-jwt-key-minimum-32-characters"
NEXTAUTH_SECRET="your-nextauth-secret-minimum-32-characters"

# =================================
# FIREBASE ADMIN SDK CONFIGURATION
# =================================
FIREBASE_PROJECT_ID="xtrawrkx"
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL="firebase-adminsdk-xxxxx@xtrawrkx.iam.gserviceaccount.com"

# Firebase Web App Config
NEXT_PUBLIC_FIREBASE_API_KEY="your-firebase-api-key"
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN="xtrawrkx.firebaseapp.com"
NEXT_PUBLIC_FIREBASE_PROJECT_ID="xtrawrkx"
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET="xtrawrkx.firebasestorage.app"
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID="your-messaging-sender-id"
NEXT_PUBLIC_FIREBASE_APP_ID="your-firebase-app-id"

# =================================
# CORS CONFIGURATION
# =================================
ALLOWED_ORIGINS="https://yourdomain.com,https://accounts.yourdomain.com,https://crm.yourdomain.com,https://pm.yourdomain.com,https://client-portal.yourdomain.com"

# =================================
# EMAIL CONFIGURATION (SMTP)
# =================================
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_SECURE="false"
SMTP_USER="your-email@gmail.com"
SMTP_PASS="your-app-password"
FROM_EMAIL="noreply@yourdomain.com"
FROM_NAME="Xtrawrkx"

# =================================
# APPLICATION SETTINGS
# =================================
NODE_ENV="production"
API_BASE_URL="https://api.yourdomain.com"
ACCOUNTS_URL="https://accounts.yourdomain.com"
CRM_URL="https://crm.yourdomain.com"
PM_DASHBOARD_URL="https://pm.yourdomain.com"
CLIENT_PORTAL_URL="https://client-portal.yourdomain.com"
```

## 🛠️ Deployment Steps

### 1. Database Setup

```bash
# Install dependencies
npm install

# Generate Prisma client
npm run db:generate

# Run database migrations
npm run db:migrate

# Seed initial data (optional)
npm run db:seed
```

### 2. Build Application

```bash
# Build for production
npm run build
```

### 3. Test Configuration

```bash
# Test email configuration
curl -X POST https://your-api-domain.com/api/email/test \
  -H "Content-Type: application/json" \
  -d '{"action": "verify"}'

# Test CORS
curl -X OPTIONS https://your-api-domain.com/api/auth/login \
  -H "Origin: https://your-frontend-domain.com"
```

### 4. Start Production Server

```bash
# Start production server
npm start

# Or with PM2 for process management
pm2 start npm --name "xtrawrkx-api" -- start
```

## 🔧 Infrastructure Recommendations

### Database

- **PostgreSQL 14+** with connection pooling
- **Backup strategy** with automated daily backups
- **SSL/TLS encryption** for database connections

### Security

- **HTTPS only** with valid SSL certificates
- **Rate limiting** (already configured in dependencies)
- **Security headers** (Helmet.js already included)
- **Environment variable encryption** in production

### Monitoring

- **Application monitoring** (e.g., New Relic, Datadog)
- **Error tracking** (e.g., Sentry)
- **Uptime monitoring** (e.g., Pingdom, UptimeRobot)

### Scaling

- **Load balancer** for multiple instances
- **CDN** for static assets
- **Database read replicas** for high traffic

## 🔍 Verification Checklist

After deployment, verify these endpoints:

- [ ] `GET /api/health` - Health check
- [ ] `POST /api/auth/login` - Authentication works
- [ ] `POST /api/email/test` - Email configuration works
- [ ] CORS headers present in responses
- [ ] Database connections working
- [ ] Firebase authentication working

## 🚨 Security Reminders

1. **Never commit `.env` files** to version control
2. **Use secrets management** in production (AWS Secrets Manager, etc.)
3. **Rotate secrets regularly**
4. **Monitor for suspicious activity**
5. **Keep dependencies updated**
6. **Use HTTPS everywhere**
7. **Implement proper logging** (but don't log sensitive data)

## 📞 Support

If you encounter issues during deployment:

1. Check the application logs
2. Verify all environment variables are set correctly
3. Test database connectivity
4. Verify Firebase configuration
5. Check CORS settings for your domains

## 🔄 Updates

To update the application:

1. Pull latest code
2. Run `npm install` for new dependencies
3. Run `npm run db:migrate` for database changes
4. Rebuild with `npm run build`
5. Restart the application

---

**Last Updated:** $(date)
**Version:** 1.0.0

