'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { ONBOARDING_API_ENDPOINTS, ONBOARDING_STEPS } from '@/lib/onboarding-config';

const STORAGE_KEY = 'onboarding-state';

// Initial state
const createInitialState = () => ({
    currentStep: 0,
    totalSteps: ONBOARDING_STEPS.length,
    account: {
        email: '',
        phone: undefined,
    },
    basics: {},
    selectedCommunities: [],
    submissions: {},
    memberships: [],
    isComplete: false,
});

export function useOnboardingState() {
    const [state, setState] = useState(createInitialState);
    const [isLoading, setIsLoading] = useState(false);
    const [loadingStates, setLoadingStates] = useState({
        account: false,
        basics: false,
        communities: false,
        submission: false,
        complete: false,
    });
    const [error, setError] = useState(null);
    const [errorTimeoutId, setErrorTimeoutId] = useState(null);
    const [lastErrorMessage, setLastErrorMessage] = useState(null);
    const [errorCooldown, setErrorCooldown] = useState(false);
    const saveTimeouts = useRef({});
    const activeRequests = useRef({});

    // Load state from localStorage on mount
    useEffect(() => {
        const savedState = localStorage.getItem(STORAGE_KEY);
        if (savedState) {
            try {
                const parsedState = JSON.parse(savedState);
                setState({ ...createInitialState(), ...parsedState });
            } catch (err) {
                console.error('Failed to parse saved onboarding state:', err);
            }
        }
    }, []);

    // Save state to localStorage whenever it changes
    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    }, [state]);

    // Cleanup timeouts on unmount
    useEffect(() => {
        return () => {
            if (errorTimeoutId) {
                clearTimeout(errorTimeoutId);
            }
            // Clear all save timeouts
            Object.values(saveTimeouts.current).forEach(timeoutId => {
                if (timeoutId) clearTimeout(timeoutId);
            });
        };
    }, [errorTimeoutId]);

    // Helper to set error with auto-clear and cooldown to prevent flickering
    const setErrorWithTimeout = useCallback((errorMessage) => {
        // Ignore if we're in cooldown period or same error message
        if (errorCooldown || (lastErrorMessage === errorMessage && error === errorMessage)) {
            return;
        }

        // Clear any existing timeout
        if (errorTimeoutId) {
            clearTimeout(errorTimeoutId);
        }

        setError(errorMessage);
        setLastErrorMessage(errorMessage);
        setErrorCooldown(true);

        // Auto-clear error after 5 seconds
        const timeoutId = setTimeout(() => {
            setError(null);
            setErrorTimeoutId(null);

            // Set a cooldown period to prevent immediate re-showing of the same error
            setTimeout(() => {
                setErrorCooldown(false);
                setLastErrorMessage(null);
            }, 2000); // 2 second cooldown after error clears
        }, 5000);

        setErrorTimeoutId(timeoutId);
    }, [errorTimeoutId, errorCooldown, lastErrorMessage, error]);

    // Generic API call helper with better error handling
    const apiCall = useCallback(async (endpoint, data, method = 'POST') => {
        try {
            const response = await fetch(endpoint, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: method !== 'GET' ? JSON.stringify(data) : undefined,
            });

            // Check if response is JSON
            const contentType = response.headers.get('content-type');
            if (!contentType || !contentType.includes('application/json')) {
                throw new Error('Server returned non-JSON response');
            }

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error || `API call failed with status ${response.status}`);
            }

            return { ok: true, data: result };
        } catch (error) {
            console.error(`API call to ${endpoint} failed:`, error);

            // More descriptive error messages
            let errorMessage = 'Unknown error';
            if (error instanceof TypeError && error.message.includes('fetch')) {
                errorMessage = 'Network error - please check your connection';
            } else if (error instanceof Error) {
                errorMessage = error.message;
            }

            return {
                ok: false,
                error: errorMessage
            };
        }
    }, []);

    // Helper to manage loading states
    const setOperationLoading = useCallback((operation, loading) => {
        setLoadingStates(prev => ({ ...prev, [operation]: loading }));
        // Update global loading state only if any operation is loading
        setLoadingStates(current => {
            const newStates = { ...current, [operation]: loading };
            const anyLoading = Object.values(newStates).some(state => state);
            setIsLoading(anyLoading);
            return newStates;
        });
    }, []);

    // Load account data with request deduplication
    const loadAccountData = useCallback(async () => {
        // Prevent multiple simultaneous requests
        if (activeRequests.current.account) {
            return;
        }

        activeRequests.current.account = true;
        setOperationLoading('account', true);
        setError(null);

        try {
            const response = await apiCall(ONBOARDING_API_ENDPOINTS.account, {}, 'GET');

            if (response.ok && response.data) {
                setState(prev => ({
                    ...prev,
                    account: response.data,
                }));
            } else {
                setErrorWithTimeout(response.error || 'Failed to load account data');
            }
        } finally {
            activeRequests.current.account = false;
            setOperationLoading('account', false);
        }
    }, [apiCall, setOperationLoading, setErrorWithTimeout]);

    // Save basics data with debouncing
    const saveBasics = useCallback(async (basics, immediate = false) => {
        // Clear existing timeout if any
        if (saveTimeouts.current.basics) {
            clearTimeout(saveTimeouts.current.basics);
        }

        // Update local state immediately for responsive UI
        setState(prev => ({
            ...prev,
            basics: { ...prev.basics, ...basics },
        }));

        // If not immediate, debounce the API call
        if (!immediate) {
            saveTimeouts.current.basics = setTimeout(() => {
                saveBasics(basics, true);
            }, 1000);
            return true;
        }

        setOperationLoading('basics', true);
        setError(null);

        const response = await apiCall(ONBOARDING_API_ENDPOINTS.basics, basics, 'PATCH');

        if (response.ok) {
            setOperationLoading('basics', false);
            return true;
        } else {
            setErrorWithTimeout(response.error || 'Failed to save basics');
            setOperationLoading('basics', false);
            return false;
        }
    }, [apiCall, setOperationLoading, setErrorWithTimeout]);

    // Save community selections with debouncing
    const saveCommunities = useCallback(async (communities, immediate = false) => {
        // Clear existing timeout if any
        if (saveTimeouts.current.communities) {
            clearTimeout(saveTimeouts.current.communities);
        }

        // Update local state immediately for responsive UI
        setState(prev => ({
            ...prev,
            selectedCommunities: communities,
        }));

        // If not immediate, debounce the API call
        if (!immediate) {
            saveTimeouts.current.communities = setTimeout(() => {
                saveCommunities(communities, true);
            }, 1000);
            return true;
        }

        setOperationLoading('communities', true);
        setError(null);

        const response = await apiCall(ONBOARDING_API_ENDPOINTS.communities, { selectedCommunities: communities }, 'PATCH');

        if (response.ok) {
            setOperationLoading('communities', false);
            return true;
        } else {
            setErrorWithTimeout(response.error || 'Failed to save communities');
            setOperationLoading('communities', false);
            return false;
        }
    }, [apiCall, setOperationLoading, setErrorWithTimeout]);

    // Submit community application
    const submitCommunityApplication = useCallback(async (community, data) => {
        setOperationLoading('submission', true);
        setError(null);

        const response = await apiCall(ONBOARDING_API_ENDPOINTS.submission, {
            community,
            data,
        });

        if (response.ok && response.data) {
            setState(prev => ({
                ...prev,
                submissions: {
                    ...prev.submissions,
                    [community]: data,
                },
                memberships: [
                    ...prev.memberships.filter(m => m.community !== community),
                    {
                        community,
                        status: response.data.status === 'submitted' ? 'pending' : 'draft',
                        submissionId: response.data.submissionId,
                    },
                ],
            }));
            setOperationLoading('submission', false);
            return { success: true, data: response.data };
        } else {
            setErrorWithTimeout(response.error || 'Failed to submit application');
            setOperationLoading('submission', false);
            return { success: false, error: response.error };
        }
    }, [apiCall, setOperationLoading]);

    // Complete onboarding
    const completeOnboarding = useCallback(async () => {
        setOperationLoading('complete', true);
        setError(null);

        const response = await apiCall(ONBOARDING_API_ENDPOINTS.complete, {});

        if (response.ok) {
            setState(prev => ({
                ...prev,
                isComplete: true,
            }));
            // Clear localStorage after completion
            localStorage.removeItem(STORAGE_KEY);
            setOperationLoading('complete', false);
            return true;
        } else {
            setErrorWithTimeout(response.error || 'Failed to complete onboarding');
            setOperationLoading('complete', false);
            return false;
        }
    }, [apiCall, setOperationLoading]);

    // Navigation helpers
    const goToStep = useCallback((step) => {
        setState(prev => ({
            ...prev,
            currentStep: Math.max(0, Math.min(step, prev.totalSteps - 1)),
        }));
    }, []);

    const nextStep = useCallback(() => {
        setState(prev => ({
            ...prev,
            currentStep: Math.min(prev.currentStep + 1, prev.totalSteps - 1),
        }));
    }, []);

    const prevStep = useCallback(() => {
        setState(prev => ({
            ...prev,
            currentStep: Math.max(prev.currentStep - 1, 0),
        }));
    }, []);

    // Get current step info
    const getCurrentStepInfo = useCallback(() => {
        return ONBOARDING_STEPS[state.currentStep] || ONBOARDING_STEPS[0];
    }, [state.currentStep]);

    // Get next community to fill
    const getNextCommunityToFill = useCallback(() => {
        return state.selectedCommunities.find(community =>
            !state.submissions[community]
        );
    }, [state.selectedCommunities, state.submissions]);

    // Check if all selected communities are filled
    const areAllCommunitiesFilled = useCallback(() => {
        return state.selectedCommunities.every(community =>
            state.submissions[community]
        );
    }, [state.selectedCommunities, state.submissions]);

    // Reset state (for testing or restart)
    const resetState = useCallback(() => {
        setState(createInitialState());
        localStorage.removeItem(STORAGE_KEY);
    }, []);

    return {
        // State
        state,
        isLoading,
        loadingStates,
        error,

        // Data operations
        loadAccountData,
        saveBasics,
        saveCommunities,
        submitCommunityApplication,
        completeOnboarding,

        // Navigation
        goToStep,
        nextStep,
        prevStep,
        getCurrentStepInfo,

        // Helpers
        getNextCommunityToFill,
        areAllCommunitiesFilled,
        resetState,

        // Utils
        clearError: () => {
            setError(null);
            setErrorCooldown(false);
            setLastErrorMessage(null);
            if (errorTimeoutId) {
                clearTimeout(errorTimeoutId);
                setErrorTimeoutId(null);
            }
        },
    };
}
