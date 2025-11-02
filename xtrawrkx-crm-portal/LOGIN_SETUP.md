# XtraWrkx CRM - Login System Setup

## Overview

This document describes the login system implementation for the XtraWrkx CRM portal, including authentication, role-based access control, and integration with the Strapi backend.

## Features Implemented

### 1. Authentication System

- **Login Page**: Modern, responsive login form with validation
- **JWT Token Management**: Secure token storage and management
- **Auto-redirect**: Automatic redirection based on authentication status
- **Logout Functionality**: Secure logout with token cleanup

### 2. Role-Based Access Control (RBAC)

- **Permission System**: Module-based permissions (leads, accounts, contacts, etc.)
- **Role Hierarchy**: Super Admin > Admin > Manager > Sales Rep > etc.
- **Protected Routes**: Route-level access control
- **Permission Hooks**: Easy-to-use permission checking hooks

### 3. Strapi Integration

- **Backend Authentication**: Integration with Strapi auth endpoints
- **User Management**: Full user data synchronization
- **Permission Sync**: Real-time permission updates from backend

## File Structure

```
src/
├── app/
│   ├── login/
│   │   └── page.jsx              # Login page component
│   ├── unauthorized/
│   │   └── page.jsx              # Access denied page
│   └── (dashboard)/
│       └── page.jsx              # Protected dashboard
├── components/
│   └── ProtectedRoute.jsx        # Route protection wrapper
├── contexts/
│   └── AuthContext.jsx           # Authentication context
├── hooks/
│   └── usePermissions.js         # Permission checking hook
└── lib/
    └── authService.js            # Strapi authentication service
```

## Usage

### 1. Basic Authentication

```jsx
import { useAuth } from "../contexts/AuthContext";

function MyComponent() {
  const { user, isAuthenticated, login, logout } = useAuth();

  const handleLogin = async (email, password) => {
    const result = await login(email, password);
    if (result.success) {
      // User logged in successfully
    }
  };
}
```

### 2. Route Protection

```jsx
import ProtectedRoute from "../components/ProtectedRoute";

function ProtectedPage() {
  return (
    <ProtectedRoute
      requiredRoles={["Admin", "Manager"]}
      requiredPermissions={[
        { module: "leads", action: "read" },
        { module: "accounts", action: "create" },
      ]}
    >
      <div>Protected content</div>
    </ProtectedRoute>
  );
}
```

### 3. Permission Checking

```jsx
import { usePermissions } from "../hooks/usePermissions";

function MyComponent() {
  const { can, hasRoleAccess, isAdminLevel } = usePermissions();

  return (
    <div>
      {can("leads", "create") && <CreateLeadButton />}
      {hasRoleAccess("Admin") && <AdminPanel />}
      {isAdminLevel() && <AdvancedSettings />}
    </div>
  );
}
```

## Configuration

### Environment Variables

Create a `.env.local` file in the project root:

```env
# Strapi Backend URL
NEXT_PUBLIC_STRAPI_URL=http://localhost:1337

# For production
# NEXT_PUBLIC_STRAPI_URL=https://your-strapi-backend.railway.app
```

### Strapi Backend Setup

Ensure your Strapi backend is running and has the following endpoints:

- `POST /api/auth/internal/login` - User login
- `GET /api/auth/me` - Get current user
- `POST /api/auth/request-reset` - Password reset request
- `POST /api/auth/reset-password` - Password reset

## Demo Credentials

The system includes demo credentials for testing:

- **Admin**: admin@xtrawrkx.com / admin123
- **Manager**: manager@xtrawrkx.com / manager123
- **User**: user@xtrawrkx.com / user123

## Security Features

1. **JWT Token Management**: Secure token storage in localStorage
2. **Automatic Token Validation**: Token verification on app load
3. **Route Protection**: Automatic redirection for unauthorized access
4. **Permission-based UI**: UI elements shown/hidden based on permissions
5. **Secure Logout**: Complete token cleanup on logout

## Role Hierarchy

1. **Super Admin** (Level 100)

   - Full system access
   - User management
   - System settings

2. **Admin** (Level 90)

   - Most system access
   - User management
   - Advanced features

3. **Manager** (Level 80)

   - Team management
   - Reports access
   - Advanced permissions

4. **Senior Sales** (Level 70)

   - Full sales access
   - Lead management
   - Deal management

5. **Sales Rep** (Level 60)

   - Basic sales access
   - Lead management
   - Limited permissions

6. **Junior Sales** (Level 50)

   - Limited sales access
   - Basic lead management

7. **Support** (Level 40)

   - Support access
   - Limited system access

8. **Viewer** (Level 30)
   - Read-only access
   - Basic viewing permissions

## Troubleshooting

### Common Issues

1. **Login Not Working**

   - Check Strapi backend is running
   - Verify NEXT_PUBLIC_STRAPI_URL is correct
   - Check browser console for errors

2. **Permission Errors**

   - Ensure user has correct role assigned in Strapi
   - Check permission configuration in backend
   - Verify user is active in Strapi

3. **Redirect Loops**
   - Check ProtectedRoute configuration
   - Verify authentication state management
   - Check for conflicting route guards

### Development Tips

1. **Testing Permissions**: Use browser dev tools to modify localStorage for testing
2. **Debug Mode**: Check browser console for authentication logs
3. **Token Expiry**: Tokens expire after 30 days (configurable in Strapi)
4. **Role Testing**: Create test users with different roles in Strapi admin

## Next Steps

1. **Password Reset**: Implement password reset flow
2. **Two-Factor Authentication**: Add 2FA support
3. **Session Management**: Implement session timeout
4. **Audit Logging**: Add user activity logging
5. **Advanced Permissions**: Implement field-level permissions

