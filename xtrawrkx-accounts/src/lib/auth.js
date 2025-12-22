// Backend API base URL - Use environment variable, fallback to localhost for development
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:1337';

// Internal user login (XtraWrkx employees)
export const signInWithEmail = async (email, password) => {
    try {
        const response = await fetch(`${API_BASE_URL}/api/auth/internal/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || data.error || 'Login failed');
        }

        // Store token and user data
        localStorage.setItem('authToken', data.token);
        localStorage.setItem('userData', JSON.stringify(data.user));

        return {
            user: data.user,
            token: data.token
        };
    } catch (error) {
        console.error('Email sign in error:', error);
        throw error;
    }
};

// Create internal user (Admin only)
export const createUserWithEmail = async (email, password, userData = {}) => {
    try {
        const token = localStorage.getItem('authToken');

        if (!token) {
            throw new Error('Authentication required');
        }

        const response = await fetch(`${API_BASE_URL}/api/auth/create-user`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({
                email,
                firstName: userData.firstName,
                lastName: userData.lastName,
                role: userData.role || 'DEVELOPER',
                department: userData.department || 'DEVELOPMENT',
                phone: userData.phone,
                sendInvitation: userData.sendInvitation !== false
            }),
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || data.error || 'User creation failed');
        }

        return data;
    } catch (error) {
        console.error('User creation error:', error);
        throw error;
    }
};

// Request password reset
export const requestPasswordReset = async (email) => {
    try {
        const response = await fetch(`${API_BASE_URL}/api/auth/request-reset`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, type: 'internal' }),
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || data.error || 'Reset request failed');
        }

        return data;
    } catch (error) {
        console.error('Password reset request error:', error);
        throw error;
    }
};

// Reset password with token
export const resetPassword = async (token, password) => {
    try {
        const response = await fetch(`${API_BASE_URL}/api/auth/reset-password`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ token, password, type: 'internal' }),
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || data.error || 'Password reset failed');
        }

        return data;
    } catch (error) {
        console.error('Password reset error:', error);
        throw error;
    }
};

// Sign out
export const signOutUser = async () => {
    try {
        // Clear stored tokens and data
        localStorage.removeItem('authToken');
        localStorage.removeItem('userData');
        return true;
    } catch (error) {
        console.error('Sign out error:', error);
        throw error;
    }
};

// Get current user token
export const getCurrentUserToken = async () => {
    try {
        return localStorage.getItem('authToken');
    } catch (error) {
        console.error('Get token error:', error);
        return null;
    }
};

// Get current user from backend
export const getCurrentUser = async (token) => {
    try {
        const authToken = token || localStorage.getItem('authToken');

        if (!authToken) {
            return null;
        }

        const response = await fetch(`${API_BASE_URL}/api/auth/me`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${authToken}`,
                'Content-Type': 'application/json',
            },
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || data.error || 'Failed to get user');
        }

        return data;
    } catch (error) {
        console.error('Get current user error:', error);
        // Clear invalid token
        localStorage.removeItem('authToken');
        localStorage.removeItem('userData');
        throw error;
    }
};

// Check if user is authenticated
export const isAuthenticated = () => {
    const token = localStorage.getItem('authToken');
    const userData = localStorage.getItem('userData');
    return !!(token && userData);
};

// Get stored user data
export const getStoredUserData = () => {
    try {
        const userData = localStorage.getItem('userData');
        return userData ? JSON.parse(userData) : null;
    } catch (error) {
        console.error('Error parsing stored user data:', error);
        localStorage.removeItem('userData');
        return null;
    }
};

