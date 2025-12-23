/**
 * Strapi Client for Accounts App
 * Handles Strapi authentication and data storage integration
 */
class StrapiClient {
    constructor() {
        // Use environment variable for API URL, fallback to localhost for development
        this.baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:1337';
        this.apiPath = '/api';
    }

    /**
     * Get authentication token from localStorage
     */
    getAuthToken() {
        if (typeof window === 'undefined') return null;
        return localStorage.getItem('authToken');
    }

    /**
     * Build request headers with auth token
     */
    async getHeaders() {
        const headers = {
            'Content-Type': 'application/json',
        };

        const token = this.getAuthToken();
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        return headers;
    }

    /**
     * Make authenticated request to Strapi
     */
    async request(endpoint, options = {}) {
        const url = `${this.baseURL}${this.apiPath}${endpoint}`;
        const headers = await this.getHeaders();

        try {
            const response = await fetch(url, {
                ...options,
                headers: {
                    ...headers,
                    ...options.headers,
                },
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Strapi request failed:', error);
            throw error;
        }
    }

    /**
     * GET request
     */
    async get(endpoint, params = {}) {
        const searchParams = new URLSearchParams();
        Object.entries(params).forEach(([key, value]) => {
            if (value !== undefined && value !== null) {
                searchParams.set(key, String(value));
            }
        });

        const queryString = searchParams.toString();
        const fullEndpoint = queryString ? `${endpoint}?${queryString}` : endpoint;

        return this.request(fullEndpoint);
    }

    /**
     * POST request
     */
    async post(endpoint, data) {
        return this.request(endpoint, {
            method: 'POST',
            body: JSON.stringify({ data }),
        });
    }

    /**
     * PUT request
     */
    async put(endpoint, data) {
        return this.request(endpoint, {
            method: 'PUT',
            body: JSON.stringify({ data }),
        });
    }

    /**
     * DELETE request
     */
    async delete(endpoint) {
        return this.request(endpoint, {
            method: 'DELETE',
        });
    }

    // User management methods

    /**
     * Create or update user in Strapi
     */
    async createOrUpdateUser(userData) {
        const userPayload = {
            email: userData.email,
            firstName: userData.firstName || '',
            lastName: userData.lastName || '',
            phone: userData.phone || '',
            authProvider: 'PASSWORD',
            emailVerified: userData.emailVerified || false,
            lastLoginAt: new Date().toISOString(),
            isActive: true,
        };

        // Only include department if it's a valid ID (number)
        if (userData.department && typeof userData.department === 'number') {
            userPayload.department = userData.department;
        }

        try {
            // Try to find existing user by email
            const existingUsers = await this.get('/xtrawrkx-users', {
                'filters[email][$eq]': userData.email,
            });

            if (existingUsers.data && existingUsers.data.length > 0) {
                // Update existing user
                const userId = existingUsers.data[0].id;
                return this.put(`/xtrawrkx-users/${userId}`, {
                    ...userPayload,
                    lastLoginAt: new Date().toISOString(),
                });
            } else {
                // Create new user
                return this.post('/xtrawrkx-users', userPayload);
            }
        } catch (error) {
            console.error('Error creating/updating user in Strapi:', error);
            throw error;
        }
    }

    /**
     * Get user by email
     */
    async getUserByEmail(email) {
        try {
            const response = await this.get('/xtrawrkx-users', {
                'filters[email][$eq]': email,
                'populate': '*',
            });

            return response.data && response.data.length > 0 ? response.data[0] : null;
        } catch (error) {
            console.error('Error fetching user by email from Strapi:', error);
            throw error;
        }
    }

    /**
     * Update user profile
     */
    async updateUserProfile(userId, profileData) {
        try {
            return this.put(`/xtrawrkx-users/${userId}`, profileData);
        } catch (error) {
            console.error('Error updating user profile in Strapi:', error);
            throw error;
        }
    }

    /**
     * Get all users (admin only)
     */
    async getAllUsers(params = {}) {
        try {
            return this.get('/xtrawrkx-users', {
                'populate': '*',
                'sort': 'createdAt:desc',
                ...params,
            });
        } catch (error) {
            console.error('Error fetching all users from Strapi:', error);
            throw error;
        }
    }

    /**
     * Delete user
     */
    async deleteUser(userId) {
        try {
            return this.delete(`/xtrawrkx-users/${userId}`);
        } catch (error) {
            console.error('Error deleting user from Strapi:', error);
            throw error;
        }
    }
}

// Export singleton instance
export const strapiClient = new StrapiClient();
export default strapiClient;
