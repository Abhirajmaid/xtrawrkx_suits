"use client";

import { useState, useEffect, createContext, useContext } from 'react';
import { sendOTP as apiSendOTP, verifyOTP as apiVerifyOTP, login as apiLogin, logout as apiLogout, getCurrentUser } from './api.js';

// Auth Context
const AuthContext = createContext(null);

// Auth Provider Component
export function AuthProvider({ children }) {
    const [session, setSession] = useState(null);
    const [status, setStatus] = useState('loading');

    useEffect(() => {
        checkAuth();
    }, []);

    const checkAuth = async () => {
        try {
            console.log('Auth check started...');
            const token = localStorage.getItem('auth_token');
            console.log('Auth token found:', !!token);

            if (!token) {
                console.log('No auth token, setting unauthenticated');
                setStatus('unauthenticated');
                return;
            }

            console.log('Getting current user...');
            const user = await getCurrentUser();
            console.log('User data received:', user);

            setSession({
                user: {
                    id: user.id,
                    email: user.email,
                    name: user.name,
                    profile: {
                        id: user.id,
                        email: user.email,
                        phone: user.phone || '',
                        onboarded: user.onboarded || false,
                        needsOnboarding: user.needsOnboarding !== false,
                    }
                }
            });
            console.log('Session set, status: authenticated');
            setStatus('authenticated');
        } catch (error) {
            console.error('Auth check failed:', error);
            localStorage.removeItem('auth_token');
            localStorage.removeItem('demo_user');
            setSession(null);
            setStatus('unauthenticated');
        }
    };

    const sendOTP = async (email, phone) => {
        try {
            setStatus('loading');
            const response = await apiSendOTP(email, phone);
            setStatus('unauthenticated'); // Still not authenticated until OTP is verified
            return response;
        } catch (error) {
            setStatus('unauthenticated');
            throw error;
        }
    };

    const verifyOTP = async (email, phone, otp, name = '') => {
        try {
            setStatus('loading');
            const response = await apiVerifyOTP(email, phone, otp, name);

            setSession({
                user: {
                    id: response.user.id,
                    email: response.user.email,
                    name: response.user.name,
                    profile: {
                        id: response.user.id,
                        email: response.user.email,
                        phone: response.user.phone || '',
                        onboarded: response.user.onboarded || false,
                        needsOnboarding: response.user.needsOnboarding !== false,
                    }
                }
            });
            setStatus('authenticated');
            return response;
        } catch (error) {
            setStatus('unauthenticated');
            throw error;
        }
    };

    const signOut = async () => {
        try {
            await apiLogout();
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            localStorage.removeItem('auth_token');
            setSession(null);
            setStatus('unauthenticated');
            window.location.href = '/auth';
        }
    };

    const signIn = async (email, password) => {
        try {
            setStatus('loading');
            const response = await apiLogin(email, password);

            setSession({
                user: {
                    id: response.user.id,
                    email: response.user.email,
                    name: response.user.name,
                    profile: {
                        id: response.user.id,
                        email: response.user.email,
                        phone: response.user.phone || '',
                        onboarded: response.user.onboarded || false,
                        needsOnboarding: response.user.needsOnboarding !== false,
                    }
                }
            });
            setStatus('authenticated');
            return response;
        } catch (error) {
            setStatus('unauthenticated');
            throw error;
        }
    };

    const register = async (email, phone, otp, name = '') => {
        // Registration is now the same as verifyOTP since account creation happens during OTP verification
        return verifyOTP(email, phone, otp, name);
    };

    return (
        <AuthContext.Provider value={{
            session,
            status,
            sendOTP,
            verifyOTP,
            signIn,
            signOut,
            register,
            checkAuth
        }}>
            {children}
        </AuthContext.Provider>
    );
}

// Hook to use auth context
export function useSession() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useSession must be used within AuthProvider');
    }

    return {
        data: context.session,
        status: context.status
    };
}

// Hook to use auth actions
export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }

    return {
        sendOTP: context.sendOTP,
        verifyOTP: context.verifyOTP,
        signIn: context.signIn,
        signOut: context.signOut,
        register: context.register,
        checkAuth: context.checkAuth
    };
}

// Export signOut and signIn for compatibility
export const signOut = () => {
    const context = useContext(AuthContext);
    return context?.signOut() || (() => {
        localStorage.removeItem('auth_token');
        window.location.href = '/auth';
    });
};

export const signIn = () => {
    window.location.href = '/auth';
};
