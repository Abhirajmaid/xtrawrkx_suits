/**
 * Centralized Authentication Service
 * Handles token management, localStorage, and authentication state
 */
class AuthService {
    static TOKEN_KEY = 'currentUser';
    static API_BASE_URL = 'https://xtrawrkxsuits-production.up.railway.app/api';

    /**
     * Get JWT token from localStorage
     */
    static getToken() {
        const userData = localStorage.getItem(this.TOKEN_KEY);
        if (!userData) return null;

        try {
            const parsed = JSON.parse(userData);
            return parsed.token;
        } catch (error) {
            console.error('Error parsing user data from localStorage:', error);
            return null;
        }
    }

    /**
     * Get complete user data from localStorage
     */
    static getUserData() {
        const userData = localStorage.getItem(this.TOKEN_KEY);
        if (!userData) return null;

        try {
            return JSON.parse(userData);
        } catch (error) {
            console.error('Error parsing user data from localStorage:', error);
            return null;
        }
    }

    /**
     * Store user data and token in localStorage
     */
    static setUserData(userData) {
        try {
            localStorage.setItem(this.TOKEN_KEY, JSON.stringify(userData));
        } catch (error) {
            console.error('Error storing user data in localStorage:', error);
        }
    }

    /**
     * Clear authentication data
     */
    static clearAuth() {
        localStorage.removeItem(this.TOKEN_KEY);
    }

    /**
     * Check if user is authenticated with valid token
     */
    static isAuthenticated() {
        const token = this.getToken();
        return token && !this.isTokenExpired(token);
    }

    /**
     * Check if JWT token is expired
     */
    static isTokenExpired(token) {
        if (!token) return true;

        try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            const currentTime = Date.now() / 1000;
            return payload.exp < currentTime;
        } catch (error) {
            console.error('Error checking token expiration:', error);
            return true;
        }
    }

    /**
     * Get token or refresh if needed
     */
    static async refreshTokenIfNeeded() {
        const currentToken = this.getToken();

        if (currentToken && !this.isTokenExpired(currentToken)) {
            return currentToken;
        }

        // Token is expired or missing, try to auto-login
        console.log('Token expired or missing, attempting auto-login...');
        return this.autoLogin();
    }

    /**
     * Auto-login with stored credentials
     * NOTE: This method should only be used in development
     * In production, users should always login manually
     */
    static async autoLogin() {
        // Disable auto-login in production
        if (process.env.NODE_ENV === 'production') {
            throw new Error('Auto-login is disabled in production');
        }

        // Check for demo credentials in environment variables
        const demoEmail = process.env.NEXT_PUBLIC_DEMO_EMAIL;
        const demoPassword = process.env.NEXT_PUBLIC_DEMO_PASSWORD;

        if (!demoEmail || !demoPassword) {
            throw new Error('Demo credentials not configured');
        }

        try {
            console.log('Attempting auto-login...');
            const response = await fetch(`${this.API_BASE_URL}/auth/internal/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    email: demoEmail,
                    password: demoPassword,
                }),
            });

            console.log('Auto-login response status:', response.status);

            if (response.ok) {
                const authData = await response.json();
                console.log('Auto-login successful:', authData.user.email);
                console.log('Received token:', authData.token ? 'Yes' : 'No');

                // Store the new token and user data
                this.setUserData({
                    ...authData.user,
                    token: authData.token,
                    name: authData.user.name || `${authData.user.firstName} ${authData.user.lastName}`,
                });

                return authData.token;
            } else {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.error?.message || 'Auto-login failed');
            }
        } catch (error) {
            console.error('Auto-login error:', error);
            this.clearAuth();
            throw error;
        }
    }

    /**
     * Manual login with email and password
     */
    static async login(email, password) {
        try {
            const response = await fetch(`${this.API_BASE_URL}/auth/internal/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ email, password }),
            });

            if (response.ok) {
                const authData = await response.json();
                console.log('Login successful:', authData.user.email);

                // Store the token and user data
                this.setUserData({
                    ...authData.user,
                    token: authData.token,
                    name: authData.user.name || `${authData.user.firstName} ${authData.user.lastName}`,
                });

                return authData;
            } else {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.error?.message || 'Login failed');
            }
        } catch (error) {
            console.error('Login error:', error);
            throw error;
        }
    }

    /**
     * Logout user
     */
    static logout() {
        this.clearAuth();
        // Optionally redirect to login page
        // window.location.href = '/auth/login';
    }

    /**
     * Make authenticated API request
     */
    static async apiRequest(endpoint, options = {}) {
        try {
            const token = await this.refreshTokenIfNeeded();
            console.log('Making API request to:', `${this.API_BASE_URL}${endpoint}`);
            console.log('Token available:', !!token);

            if (!token) {
                throw new Error('Authentication required');
            }

            const config = {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    ...options.headers,
                },
                ...options,
            };

            // Only set Content-Type for non-FormData requests
            if (!(options.body instanceof FormData)) {
                config.headers['Content-Type'] = 'application/json';
            }

            console.log('Request config:', config);
            const response = await fetch(`${this.API_BASE_URL}${endpoint}`, config);

            if (!response.ok) {
                if (response.status === 401) {
                    // Token might be invalid, clear auth and try once more
                    this.clearAuth();
                    throw new Error('Authentication failed');
                }

                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.error?.message || `HTTP ${response.status}: ${response.statusText}`);
            }

            return response.json();
        } catch (error) {
            console.error('API request failed:', error);
            throw error;
        }
    }

    /**
     * Get current user info
     */
    static getCurrentUser() {
        return this.getUserData();
    }

    /**
     * Check if current user has specific role
     */
    static hasRole(role) {
        const userData = this.getUserData();
        return userData?.role === role;
    }

    /**
     * Check if current user is admin
     */
    static isAdmin() {
        return this.hasRole('ADMIN');
    }

    /**
     * Fetch all active departments
     */
    static async getDepartments() {
        try {
            const response = await this.apiRequest('/departments');
            return response.data || [];
        } catch (error) {
            console.error('Error fetching departments:', error);
            throw error;
        }
    }

    /**
     * Fetch department statistics
     */
    static async getDepartmentStats() {
        try {
            const response = await this.apiRequest('/departments/stats');
            return response.data || [];
        } catch (error) {
            console.error('Error fetching department stats:', error);
            throw error;
        }
    }
}

export default AuthService;
