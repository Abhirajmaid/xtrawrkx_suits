import { z } from 'zod';
import { apiResponseSchema, paginatedResponseSchema } from './api-schemas.js';

/**
 * Strapi Client wrapper with type safety and error handling
 */
class StrapiClient {
    constructor() {
        this.baseURL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';
        this.apiPath = '/api';
        this.useMocks = process.env.NEXT_PUBLIC_USE_MOCKS === 'true' || process.env.NODE_ENV === 'development';
    }

    /**
     * Get authentication token from session
     * @returns {string|null}
     */
    getAuthToken() {
        if (typeof window === 'undefined') return null;

        // For now, return a mock token
        // TODO: Replace with actual NextAuth session token
        return 'mock-jwt-token';
    }

    /**
     * Build request headers
     * @returns {Headers}
     */
    getHeaders() {
        const headers = new Headers({
            'Content-Type': 'application/json',
        });

        const token = this.getAuthToken();
        if (token) {
            headers.set('Authorization', `Bearer ${token}`);
        }

        return headers;
    }

    /**
     * Build URL with query parameters
     * @param {string} endpoint 
     * @param {Record<string, any>} params 
     * @returns {string}
     */
    buildURL(endpoint, params = {}) {
        const url = new URL(`${this.baseURL}${this.apiPath}${endpoint}`);

        Object.entries(params).forEach(([key, value]) => {
            if (value !== undefined && value !== null) {
                url.searchParams.set(key, String(value));
            }
        });

        return url.toString();
    }

    /**
     * Make HTTP request with error handling
     * @param {string} url 
     * @param {RequestInit} options 
     * @returns {Promise<any>}
     */
    async request(url, options = {}) {
        try {
            const response = await fetch(url, {
                ...options,
                headers: this.getHeaders(),
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
            }

            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Strapi request failed:', error);
            throw error;
        }
    }

    /**
     * GET request with schema validation
     * @param {string} endpoint 
     * @param {Record<string, any>} params 
     * @param {z.ZodSchema} schema 
     * @returns {Promise<any>}
     */
    async get(endpoint, params = {}, schema = null) {
        const url = this.buildURL(endpoint, params);
        const data = await this.request(url);

        if (schema) {
            return schema.parse(data);
        }
        return data;
    }

    /**
     * POST request with schema validation
     * @param {string} endpoint 
     * @param {any} body 
     * @param {z.ZodSchema} schema 
     * @returns {Promise<any>}
     */
    async post(endpoint, body, schema = null) {
        const url = this.buildURL(endpoint);
        const data = await this.request(url, {
            method: 'POST',
            body: JSON.stringify(body),
        });

        if (schema) {
            return schema.parse(data);
        }
        return data;
    }

    /**
     * PUT request with schema validation
     * @param {string} endpoint 
     * @param {any} body 
     * @param {z.ZodSchema} schema 
     * @returns {Promise<any>}
     */
    async put(endpoint, body, schema = null) {
        const url = this.buildURL(endpoint);
        const data = await this.request(url, {
            method: 'PUT',
            body: JSON.stringify(body),
        });

        if (schema) {
            return schema.parse(data);
        }
        return data;
    }

    /**
     * DELETE request
     * @param {string} endpoint 
     * @returns {Promise<any>}
     */
    async delete(endpoint) {
        const url = this.buildURL(endpoint);
        return this.request(url, {
            method: 'DELETE',
        });
    }

    // Convenience methods for common patterns

    /**
     * Get paginated results
     * @param {string} endpoint 
     * @param {Record<string, any>} params 
     * @param {z.ZodSchema} itemSchema 
     * @returns {Promise<any>}
     */
    async getPaginated(endpoint, params = {}, itemSchema = null) {
        const schema = itemSchema ? paginatedResponseSchema(itemSchema) : null;
        return this.get(endpoint, params, schema);
    }

    /**
     * Get single item with API response wrapper
     * @param {string} endpoint 
     * @param {Record<string, any>} params 
     * @param {z.ZodSchema} itemSchema 
     * @returns {Promise<any>}
     */
    async getOne(endpoint, params = {}, itemSchema = null) {
        const schema = itemSchema ? apiResponseSchema(itemSchema) : null;
        return this.get(endpoint, params, schema);
    }

    /**
     * Create item with API response wrapper
     * @param {string} endpoint 
     * @param {any} body 
     * @param {z.ZodSchema} itemSchema 
     * @returns {Promise<any>}
     */
    async create(endpoint, body, itemSchema = null) {
        const schema = itemSchema ? apiResponseSchema(itemSchema) : null;
        return this.post(endpoint, body, schema);
    }

    /**
     * Update item with API response wrapper
     * @param {string} endpoint 
     * @param {any} body 
     * @param {z.ZodSchema} itemSchema 
     * @returns {Promise<any>}
     */
    async update(endpoint, body, itemSchema = null) {
        const schema = itemSchema ? apiResponseSchema(itemSchema) : null;
        return this.put(endpoint, body, schema);
    }
}

// Export singleton instance
export const strapiClient = new StrapiClient();
export default strapiClient;


