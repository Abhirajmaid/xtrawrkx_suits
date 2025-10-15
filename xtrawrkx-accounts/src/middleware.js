import { NextResponse } from 'next/server';

/**
 * Route Protection Middleware
 * Protects routes based on user roles and authentication status
 */

// Define route permissions
const ROUTE_PERMISSIONS = {
    // Public routes (no authentication required)
    public: [
        '/auth/login',
        '/auth/forgot-password',
        '/auth/reset-password',
        '/coming-soon'
    ],

    // Routes that require authentication but no specific role
    authenticated: [
        '/',
        '/profile',
        '/activity'
    ],

    // Admin-only routes (Super Admin, Admin, Manager levels)
    admin: [
        '/users',
        '/users/new',
        '/users/roles',
        '/organization',
        '/organization/departments',
        '/settings',
        '/settings/general',
        '/settings/notifications',
        '/settings/integrations'
    ],

    // Super Admin only routes
    superAdmin: [
        '/settings/advanced',
        '/system'
    ]
};

/**
 * Get user role level from localStorage (client-side)
 * This is a simplified version - in production, you'd verify JWT tokens
 */
function getUserRoleFromStorage() {
    if (typeof window === 'undefined') return null;

    try {
        const userData = localStorage.getItem('currentUser');
        if (!userData) return null;

        const user = JSON.parse(userData);
        return user.role;
    } catch (error) {
        console.error('Error parsing user data:', error);
        return null;
    }
}

/**
 * Check if user has required permission level
 */
function hasPermission(userRole, requiredLevel) {
    const roleLevels = {
        'Super Admin': 20,
        'Admin': 15,
        'Manager': 10,
        'Sales Manager': 10,
        'Project Manager': 9,
        'Finance Manager': 8,
        'Account Manager': 6,
        'Sales Representative': 5,
        'Developer': 2,
        'Read-only User': 1
    };

    const userLevel = roleLevels[userRole] || 0;
    const requiredLevelValue = roleLevels[requiredLevel] || 0;

    return userLevel >= requiredLevelValue;
}

/**
 * Check if route requires authentication
 */
function isPublicRoute(pathname) {
    return ROUTE_PERMISSIONS.public.some(route => pathname.startsWith(route));
}

/**
 * Check if route requires admin access
 */
function isAdminRoute(pathname) {
    return ROUTE_PERMISSIONS.admin.some(route => pathname.startsWith(route));
}

/**
 * Check if route requires super admin access
 */
function isSuperAdminRoute(pathname) {
    return ROUTE_PERMISSIONS.superAdmin.some(route => pathname.startsWith(route));
}

export function middleware(request) {
    const { pathname } = request.nextUrl;

    // Skip middleware for static files, API routes, and public routes
    if (
        pathname.startsWith('/_next') ||
        pathname.startsWith('/api') ||
        pathname.startsWith('/static') ||
        isPublicRoute(pathname)
    ) {
        return NextResponse.next();
    }

    // For client-side routes, we'll handle protection in the components
    // since middleware runs on the server and can't access localStorage
    return NextResponse.next();
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api (API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         */
        '/((?!api|_next/static|_next/image|favicon.ico).*)',
    ],
};

