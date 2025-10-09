// Background Service Worker for Xtrawrkx CRM LinkedIn Extractor

// Initialize when service worker starts
console.log('Xtrawrkx CRM LinkedIn Extractor background script loaded');

// Listen for extension installation
chrome.runtime.onInstalled.addListener((details) => {
    console.log('Extension installed:', details.reason);

    // Set default settings
    chrome.storage.local.set({
        crmEndpoint: 'http://localhost:3001',
        autoExtract: true,
        extractionCount: 0,
        installDate: new Date().toISOString()
    });

    // Show welcome notification
    if (details.reason === 'install') {
        try {
            chrome.notifications.create({
                type: 'basic',
                iconUrl: 'icons/icon48.svg',
                title: 'Xtrawrkx CRM Extension',
                message: 'Extension installed successfully! Navigate to LinkedIn profiles to start extracting data.'
            });
        } catch (error) {
            console.log('Notification not available:', error);
        }
    }
});

// Listen for messages from content script and popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    handleMessage(request, sender, sendResponse);
    return true; // Keep message channel open for async responses
});

// Listen for tab updates to auto-extract if enabled
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    handleTabUpdate(tabId, changeInfo, tab);
});

// Listen for action button clicks
chrome.action.onClicked.addListener(async (tab) => {
    console.log('Extension icon clicked on tab:', tab.url);

    // Check if we're on a LinkedIn profile page
    if (tab.url && tab.url.includes('linkedin.com/in/')) {
        try {
            // Inject content script if not already injected
            await chrome.scripting.executeScript({
                target: { tabId: tab.id },
                files: ['content.js']
            });

            // Wait a moment for script to initialize
            setTimeout(async () => {
                try {
                    // Send message to show sidebar
                    await chrome.tabs.sendMessage(tab.id, { action: 'showSidebar' });
                } catch (error) {
                    console.error('Error showing sidebar:', error);
                }
            }, 500);

        } catch (error) {
            console.error('Error injecting content script:', error);
        }
    } else {
        // Show notification that we need to be on LinkedIn
        try {
            chrome.notifications.create({
                type: 'basic',
                iconUrl: 'icons/icon48.png',
                title: 'Xtrawrkx CRM',
                message: 'Please navigate to a LinkedIn profile page to extract data.'
            });
        } catch (error) {
            console.log('Notification not available:', error);
        }
    }
});

async function handleMessage(request, sender, sendResponse) {
    try {
        switch (request.action) {
            case 'sendToCRM':
                const result = await sendToCRM(request.endpoint, request.data);
                sendResponse(result);
                break;

            case 'openPopup':
                // Popup will open automatically when extension icon is clicked
                sendResponse({ success: true });
                break;

            case 'getTabInfo':
                const tabInfo = await getTabInfo(sender.tab.id);
                sendResponse(tabInfo);
                break;

            case 'logExtraction':
                await logExtraction(request.data);
                sendResponse({ success: true });
                break;

            default:
                sendResponse({ error: 'Unknown action' });
        }
    } catch (error) {
        console.error('Error handling message:', error);
        sendResponse({ success: false, error: error.message });
    }
}

async function handleTabUpdate(tabId, changeInfo, tab) {
    // Only process when page is completely loaded
    if (changeInfo.status !== 'complete') return;

    // Check if it's a LinkedIn profile page
    if (!tab.url || !tab.url.includes('linkedin.com/in/')) return;

    try {
        // Check if auto-extract is enabled
        const settings = await chrome.storage.local.get(['autoExtract']);
        if (settings.autoExtract === false) return;

        // Update badge to show extraction is available
        chrome.action.setBadgeText({
            text: '!',
            tabId: tabId
        });

        chrome.action.setBadgeBackgroundColor({
            color: '#667eea',
            tabId: tabId
        });

    } catch (error) {
        console.error('Error handling tab update:', error);
    }
}

async function sendToCRM(endpoint, contactData) {
    try {
        console.log('Sending contact to CRM:', endpoint, contactData);

        // Validate endpoint
        if (!endpoint || !endpoint.startsWith('http')) {
            throw new Error('Invalid CRM endpoint');
        }

        // Validate required fields
        if (!contactData.name) {
            throw new Error('Contact name is required');
        }

        // Make API request
        const response = await fetch(`${endpoint}/api/contacts`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'User-Agent': 'Xtrawrkx-CRM-Extension/1.0.0'
            },
            body: JSON.stringify({
                ...contactData,
                source: 'chrome-extension',
                createdAt: new Date().toISOString()
            })
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`HTTP ${response.status}: ${errorText}`);
        }

        const result = await response.json();

        // Log successful extraction
        await logExtraction({
            contactName: contactData.name,
            company: contactData.company,
            endpoint: endpoint,
            success: true
        });

        // Show success notification
        try {
            chrome.notifications.create({
                type: 'basic',
                iconUrl: 'icons/icon48.svg',
                title: 'Contact Added to CRM',
                message: `${contactData.name} has been successfully added to your CRM.`
            });
        } catch (error) {
            console.log('Notification not available:', error);
        }

        return { success: true, data: result };

    } catch (error) {
        console.error('Error sending to CRM:', error);

        // Log failed extraction
        await logExtraction({
            contactName: contactData.name,
            company: contactData.company,
            endpoint: endpoint,
            success: false,
            error: error.message
        });

        return { success: false, error: error.message };
    }
}

async function getTabInfo(tabId) {
    try {
        const tab = await chrome.tabs.get(tabId);
        return {
            url: tab.url,
            title: tab.title,
            isLinkedIn: tab.url && tab.url.includes('linkedin.com/in/')
        };
    } catch (error) {
        console.error('Error getting tab info:', error);
        return { error: error.message };
    }
}

async function logExtraction(data) {
    try {
        // Get current stats
        const stats = await chrome.storage.local.get([
            'extractionCount',
            'extractionHistory',
            'lastExtraction'
        ]);

        const extractionCount = (stats.extractionCount || 0) + 1;
        const extractionHistory = stats.extractionHistory || [];

        // Add new extraction to history (keep last 50)
        extractionHistory.unshift({
            ...data,
            timestamp: new Date().toISOString(),
            extractionId: extractionCount
        });

        if (extractionHistory.length > 50) {
            extractionHistory.splice(50);
        }

        // Update storage
        await chrome.storage.local.set({
            extractionCount,
            extractionHistory,
            lastExtraction: new Date().toISOString()
        });

        // Update badge with count
        chrome.action.setBadgeText({
            text: extractionCount.toString()
        });

        console.log('Extraction logged:', data);

    } catch (error) {
        console.error('Error logging extraction:', error);
    }
}

// Clean up old data periodically
chrome.alarms.create('cleanup', { periodInMinutes: 24 * 60 });
chrome.alarms.onAlarm.addListener(async (alarm) => {
    if (alarm.name === 'cleanup') {
        try {
            const data = await chrome.storage.local.get(['extractionHistory']);
            const history = data.extractionHistory || [];

            // Remove extractions older than 30 days
            const thirtyDaysAgo = new Date();
            thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

            const cleanHistory = history.filter(extraction => {
                const extractionDate = new Date(extraction.timestamp);
                return extractionDate > thirtyDaysAgo;
            });

            if (cleanHistory.length !== history.length) {
                await chrome.storage.local.set({ extractionHistory: cleanHistory });
                console.log(`Cleaned up ${history.length - cleanHistory.length} old extractions`);
            }
        } catch (error) {
            console.error('Error cleaning up old data:', error);
        }
    }
});
