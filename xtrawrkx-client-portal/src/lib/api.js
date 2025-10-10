/**
 * API layer with typed functions for all endpoints
 * This provides a clean interface for components to use
 */

import backendClient from './backendClient.js';

// ============================================================================
// Authentication & Session
// ============================================================================

/**
 * Send OTP to email and phone
 * @param {string} email 
 * @param {string} phone 
 * @returns {Promise<{success: boolean, message: string, tempOTP?: string}>}
 */
export async function sendOTP(email, phone) {
    return backendClient.post('/auth/send-otp', {
        email,
        phone
    });
}

/**
 * Verify OTP and create account
 * @param {string} email 
 * @param {string} phone 
 * @param {string} otp 
 * @param {string} name 
 * @returns {Promise<{user: any, token: string}>}
 */
export async function verifyOTP(email, phone, otp, name = '') {
    const response = await backendClient.post('/auth/verify-otp', {
        email,
        phone,
        otp,
        name
    });

    // Store token in localStorage (client-side only)
    if (response.token && typeof window !== 'undefined') {
        localStorage.setItem('auth_token', response.token);
    }

    return response;
}

/**
 * Login user (existing users only)
 * @param {string} email 
 * @param {string} password 
 * @returns {Promise<{user: any, token: string}>}
 */
export async function login(email, password) {
    const response = await backendClient.post('/auth/login', {
        email,
        password
    });

    // Store token in localStorage (client-side only)
    if (response.token && typeof window !== 'undefined') {
        localStorage.setItem('auth_token', response.token);
    }

    return response;
}

/**
 * Get current user session
 * @returns {Promise<any>}
 */
export async function getCurrentUser() {
    // Check if this is a demo user (client-side only)
    if (typeof window !== 'undefined') {
        const demoUser = localStorage.getItem('demo_user');
        if (demoUser) {
            try {
                return JSON.parse(demoUser);
            } catch (error) {
                console.error('Error parsing demo user:', error);
                localStorage.removeItem('demo_user');
            }
        }
    }

    // Otherwise, use the regular API
    return backendClient.get('/auth/me');
}

/**
 * Logout user
 * @returns {Promise<void>}
 */
export async function logout() {
    if (typeof window !== 'undefined') {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('demo_user'); // Also remove demo user data
    }
    return Promise.resolve();
}

// ============================================================================
// Onboarding
// ============================================================================

/**
 * Get account data for onboarding
 * @returns {Promise<{email: string, phone: string, name: string}>}
 */
export async function getOnboardingAccount() {
    // Check if this is a demo user (client-side only)
    if (typeof window !== 'undefined') {
        const demoUser = localStorage.getItem('demo_user');
        if (demoUser) {
            try {
                const user = JSON.parse(demoUser);
                return {
                    email: user.email,
                    phone: user.phone,
                    name: user.name
                };
            } catch (error) {
                console.error('Error parsing demo user for onboarding:', error);
                localStorage.removeItem('demo_user');
            }
        }
    }

    // Otherwise, use the regular API
    return backendClient.get('/onboarding/account');
}

/**
 * Save basics data
 * @param {Object} data - Basics form data
 * @returns {Promise<any>}
 */
export async function saveOnboardingBasics(data) {
    return backendClient.post('/onboarding/basics', data);
}

/**
 * Save communities data
 * @param {Object} data - Communities selection data
 * @returns {Promise<any>}
 */
export async function saveOnboardingCommunities(data) {
    return backendClient.post('/onboarding/communities', data);
}

/**
 * Save community submission data
 * @param {Object} data - Community submission data
 * @returns {Promise<any>}
 */
export async function saveOnboardingSubmission(data) {
    return backendClient.post('/onboarding/submission', data);
}

/**
 * Complete onboarding and create initial project
 * @param {Object} data - Onboarding completion data
 * @returns {Promise<any>}
 */
export async function completeOnboarding(data) {
    return backendClient.post('/onboarding/complete', data);
}

/**
 * Get onboarding completion status
 * @returns {Promise<any>}
 */
export async function getOnboardingStatus() {
    return backendClient.get('/onboarding/complete');
}