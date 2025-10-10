import {
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
    RecaptchaVerifier,
    signInWithPhoneNumber,
    updateProfile
} from "firebase/auth";
import { auth } from "./firebase";

// Backend API base URL
const API_BASE_URL = 'http://localhost:3004';

// Sign in with email and password
export const signInWithEmail = async (email, password) => {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const idToken = await userCredential.user.getIdToken();

        // Send to backend for database sync
        const response = await fetch(`${API_BASE_URL}/api/auth/firebase-login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ idToken }),
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || 'Login failed');
        }

        return {
            user: data.user,
            token: data.token,
            firebaseUser: userCredential.user
        };
    } catch (error) {
        console.error('Email sign in error:', error);
        throw error;
    }
};

// Create user with email and password
export const createUserWithEmail = async (email, password, userData = {}) => {
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);

        // Update profile if name provided
        if (userData.firstName || userData.lastName) {
            await updateProfile(userCredential.user, {
                displayName: `${userData.firstName || ''} ${userData.lastName || ''}`.trim()
            });
        }

        const idToken = await userCredential.user.getIdToken();

        // Send to backend for database sync
        const response = await fetch(`${API_BASE_URL}/api/auth/firebase-login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                idToken,
                userData
            }),
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || 'Registration failed');
        }

        return {
            user: data.user,
            token: data.token,
            firebaseUser: userCredential.user
        };
    } catch (error) {
        console.error('Email registration error:', error);
        throw error;
    }
};

// Sign in with phone number
export const signInWithPhone = async (phoneNumber, appVerifier) => {
    try {
        const confirmationResult = await signInWithPhoneNumber(auth, phoneNumber, appVerifier);
        return confirmationResult;
    } catch (error) {
        console.error('Phone sign in error:', error);
        throw error;
    }
};

// Verify OTP and complete phone authentication
export const verifyOTP = async (confirmationResult, otp, userData = {}) => {
    try {
        const userCredential = await confirmationResult.confirm(otp);
        const idToken = await userCredential.user.getIdToken();

        // Send to backend for database sync
        const response = await fetch(`${API_BASE_URL}/api/auth/firebase-login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                idToken,
                userData
            }),
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || 'OTP verification failed');
        }

        return {
            user: data.user,
            token: data.token,
            firebaseUser: userCredential.user
        };
    } catch (error) {
        console.error('OTP verification error:', error);
        throw error;
    }
};

// Set up reCAPTCHA verifier
export const setupRecaptcha = (containerId) => {
    try {
        const recaptchaVerifier = new RecaptchaVerifier(auth, containerId, {
            size: 'invisible',
            callback: (response) => {
                console.log('reCAPTCHA solved');
            },
            'expired-callback': () => {
                console.log('reCAPTCHA expired');
            }
        });
        return recaptchaVerifier;
    } catch (error) {
        console.error('reCAPTCHA setup error:', error);
        throw error;
    }
};

// Sign out
export const signOutUser = async () => {
    try {
        await signOut(auth);
        // Clear any stored tokens
        localStorage.removeItem('authToken');
        localStorage.removeItem('userData');
    } catch (error) {
        console.error('Sign out error:', error);
        throw error;
    }
};

// Listen to authentication state changes
export const onAuthStateChange = (callback) => {
    return onAuthStateChanged(auth, callback);
};

// Get current user token
export const getCurrentUserToken = async () => {
    try {
        if (auth.currentUser) {
            return await auth.currentUser.getIdToken();
        }
        return null;
    } catch (error) {
        console.error('Get token error:', error);
        return null;
    }
};

// Refresh user token
export const refreshUserToken = async () => {
    try {
        if (auth.currentUser) {
            const idToken = await auth.currentUser.getIdToken(true); // Force refresh

            // Sync with backend
            const response = await fetch(`${API_BASE_URL}/api/auth/firebase-login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ idToken }),
            });

            const data = await response.json();

            if (response.ok) {
                return {
                    user: data.user,
                    token: data.token
                };
            }
        }
        return null;
    } catch (error) {
        console.error('Token refresh error:', error);
        return null;
    }
};

// Traditional login fallback (for internal users)
export const traditionalLogin = async (email, password) => {
    try {
        const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || 'Login failed');
        }

        return data;
    } catch (error) {
        console.error('Traditional login error:', error);
        throw error;
    }
};

// Get current user from backend
export const getCurrentUser = async (token) => {
    try {
        const response = await fetch(`${API_BASE_URL}/api/auth/me`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || 'Failed to get user');
        }

        return data;
    } catch (error) {
        console.error('Get current user error:', error);
        throw error;
    }
};

