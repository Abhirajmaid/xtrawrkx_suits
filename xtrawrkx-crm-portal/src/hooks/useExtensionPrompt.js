import { useState, useEffect } from 'react';

/**
 * Hook to manage the extension download prompt
 * Shows the modal to first-time users or when extension is not detected
 */
export function useExtensionPrompt() {
    const [showModal, setShowModal] = useState(false);
    const [isExtensionInstalled, setIsExtensionInstalled] = useState(false);
    const [hasShownThisSession, setHasShownThisSession] = useState(false);

    useEffect(() => {
        // Check if extension is installed
        const checkExtensionInstalled = () => {
            // The extension should set this flag when it loads
            return window.xtrawrkxExtensionInstalled === true;
        };

        // Check for extension periodically
        const extensionCheckInterval = setInterval(() => {
            const installed = checkExtensionInstalled();
            setIsExtensionInstalled(installed);

            if (installed && showModal) {
                // Extension was installed while modal was open
                setShowModal(false);
            }
        }, 2000);

        // Determine if we should show the modal
        const shouldShowModal = () => {
            // Don't show if already shown this session
            if (hasShownThisSession) {
                return false;
            }

            // Don't show if extension is already installed
            if (checkExtensionInstalled()) {
                setIsExtensionInstalled(true);
                return false;
            }

            // Show once per reload if extension is not installed
            return true;
        };

        // Show modal after a short delay to let the page load
        const timer = setTimeout(() => {
            if (shouldShowModal()) {
                setShowModal(true);
                setHasShownThisSession(true);
            }
        }, 3000);

        return () => {
            clearTimeout(timer);
            clearInterval(extensionCheckInterval);
        };
    }, [showModal, hasShownThisSession]);

    const handleCloseModal = () => {
        setShowModal(false);
        // Don't set any localStorage - allow showing again on next reload
    };

    const handleDismissForever = () => {
        setShowModal(false);
        localStorage.setItem('extensionPromptDismissed', 'true');
    };

    const handleShowModal = () => {
        setShowModal(true);
    };

    return {
        showModal,
        isExtensionInstalled,
        handleCloseModal,
        handleDismissForever,
        handleShowModal
    };
}
