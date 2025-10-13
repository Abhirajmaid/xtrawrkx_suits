# Authentication System Migration - Complete

## Overview

The authentication system has been successfully migrated from Firebase to a unified Strapi-based authentication system. This provides better control, reduced external dependencies, and improved integration with the existing data model.

## Key Changes Made

### 1. Database Schema Updates ✅

- Enhanced `XtrawrkxUser` schema with password authentication fields
- Added password reset and invitation token support
- Updated `Account` schema for client authentication
- Added `portalAccessLevel` to `Contact` schema for role-based access

### 2. Backend Authentication System ✅

- **New Controllers:**
  - `src/api/auth/controllers/auth.js` - Handles internal and client authentication
  - `src/api/onboarding/controllers/onboarding.js` - Manages client portal registration
- **Middleware:**
  - `src/middlewares/authenticate.js` - JWT token verification
  - `src/middlewares/rbac.js` - Role-based access control
- **API Endpoints:**
  - `POST /api/auth/internal/login` - Internal user login
  - `POST /api/auth/client/login` - Client account login
  - `POST /api/auth/create-user` - Create internal users (Admin only)
  - `POST /api/auth/request-reset` - Password reset request
  - `POST /api/auth/reset-password` - Reset password with token
  - `GET /api/auth/me` - Get current user info
  - `POST /api/onboarding/complete` - Complete client onboarding
  - `POST /api/onboarding/add-contact` - Add contacts to account
  - `GET /api/onboarding/contacts` - Get account contacts

### 3. Frontend Updates ✅

- **Accounts Portal:**
  - Updated `src/lib/auth.js` to use Strapi authentication
  - Removed Firebase dependencies
  - Added user management interface at `/users`
- **Client Portal:**
  - Integrated login functionality into onboarding page
  - Updated `src/lib/strapiClient.js` for new auth system
  - Added role-based access control components
  - Created `AuthProvider` for context management

### 4. Role-Based Access Control ✅

- **Internal Users:**
  - ADMIN: Full system access
  - MANAGER: Department-specific access
  - PROJECT_MANAGER: Project management access
  - SALES_REP: Sales and customer data access
  - DEVELOPER: Development resources access
  - DESIGNER: Design resources access
- **Client Portal Access Levels:**
  - FULL_ACCESS: All portal features
  - PROJECT_VIEW: Projects and files only
  - INVOICE_VIEW: Invoices and billing only
  - READ_ONLY: View-only access
  - NO_ACCESS: No portal access

### 5. Shared Account Authentication ✅

- Clients use company-level credentials
- All contacts within a company share the same login
- Role-based permissions determine individual access levels
- Primary contact has full access by default

## Authentication Flow

### Internal Users (XtraWrkx Employees)

1. Super admin creates user via accounts portal
2. System generates temporary password and sends invitation email
3. User logs in with email/password
4. JWT token issued with role and department information
5. Role-based middleware controls access to resources

### Client Portal Users

1. **New Clients:** Complete onboarding with company and contact information
2. **Existing Clients:** Login with company email and password
3. System authenticates at account level
4. All contacts associated with account can access portal
5. Individual permissions based on contact role and access level

## Environment Variables

### Strapi Backend

```env
# Database
DATABASE_CLIENT=sqlite
DATABASE_FILENAME=.tmp/data.db

# JWT Secret
JWT_SECRET=your-jwt-secret-here

# Email Configuration (for invitations and password resets)
EMAIL_PROVIDER=sendgrid
SENDGRID_API_KEY=your-sendgrid-api-key

# Frontend URLs
FRONTEND_URL=http://localhost:3003
CLIENT_PORTAL_URL=http://localhost:3000
```

### Frontend Applications

```env
# Strapi Backend URL
NEXT_PUBLIC_STRAPI_URL=http://localhost:1337

# Use mocks for development (optional)
NEXT_PUBLIC_USE_MOCKS=false
```

## Installation & Setup

### 1. Install Dependencies

```bash
# Backend (Strapi)
cd xtrawrkx-backend-strapi
npm install
npm install bcryptjs

# Accounts Portal
cd xtrawrkx-accounts
npm install

# Client Portal
cd xtrawrkx-client-portal
npm install
```

### 2. Database Migration

```bash
cd xtrawrkx-backend-strapi
npm run strapi build
npm run develop
```

The updated schemas will be automatically applied.

### 3. Create Super Admin

```bash
# Access Strapi admin at http://localhost:1337/admin
# Create admin user through the interface
# Or use the API to create the first admin user
```

### 4. Start Applications

```bash
# Start Strapi backend
cd xtrawrkx-backend-strapi && npm run develop

# Start accounts portal
cd xtrawrkx-accounts && npm run dev

# Start client portal
cd xtrawrkx-client-portal && npm run dev
```

## Usage Examples

### Creating Internal Users

```javascript
// Super admin creates new user
const userData = {
  email: "john@xtrawrkx.com",
  firstName: "John",
  lastName: "Developer",
  role: "DEVELOPER",
  department: "DEVELOPMENT",
  sendInvitation: true,
};

const result = await createUserWithEmail("", "", userData);
```

### Client Portal Registration

```javascript
// Complete onboarding
const onboardingData = {
  companyName: "Acme Corp",
  industry: "Technology",
  email: "admin@acme.com",
  contactFirstName: "Jane",
  contactLastName: "Smith",
  contactEmail: "jane@acme.com",
  password: "securePassword123",
};

const result = await strapiClient.completeOnboarding(onboardingData);
```

### Role-Based Access Check

```javascript
// Check if current contact can access section
const canViewProjects = canAccessSection("projects");
const canUploadFiles = hasPermission("upload");
```

## Security Features

- **Password Hashing:** bcrypt with salt rounds
- **JWT Tokens:** Secure token-based authentication
- **Role-Based Access:** Granular permission system
- **Password Reset:** Secure token-based password reset
- **Email Verification:** Account activation via email
- **Session Management:** Proper token storage and cleanup

## Migration Benefits

1. **Reduced Dependencies:** No longer dependent on Firebase
2. **Better Integration:** Direct integration with existing data model
3. **Cost Effective:** No external service fees
4. **Full Control:** Complete control over authentication logic
5. **Unified System:** Single authentication system for all users
6. **Role-Based Access:** Granular permission control
7. **Shared Accounts:** Simplified client portal access

## Testing

### Internal User Login

1. Navigate to `http://localhost:3003/auth/login`
2. Use super admin credentials to log in
3. Create additional users via `/users` page
4. Test role-based access controls

### Client Portal Access

1. Navigate to `http://localhost:3000/onboarding`
2. Complete registration or use existing credentials
3. Test different contact roles and access levels
4. Verify shared account functionality

## Troubleshooting

### Common Issues

1. **Token Expired:** Clear localStorage and re-login
2. **Permission Denied:** Check user role and access levels
3. **Email Not Sent:** Verify email configuration in Strapi
4. **Database Errors:** Ensure Strapi is running and schemas are updated

### Logs

- Strapi logs: Check console output
- Frontend errors: Check browser developer tools
- Authentication errors: Check network tab for API responses

## Future Enhancements

1. **Two-Factor Authentication:** Add 2FA support
2. **Single Sign-On:** Integrate with SSO providers
3. **Audit Logging:** Track authentication events
4. **Session Management:** Advanced session controls
5. **API Rate Limiting:** Prevent brute force attacks

---

**Migration Status:** ✅ Complete
**Last Updated:** December 2024
**Version:** 2.0.0



