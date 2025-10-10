// Popup JavaScript for Xtrawrkx CRM LinkedIn Extractor
class PopupManager {
    constructor() {
        this.extractedData = null;
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.loadSettings();
        this.checkCurrentTab();
    }

    setupEventListeners() {
        // Extract button
        document.getElementById('extract-btn').addEventListener('click', () => {
            this.extractData();
        });

        // Send to CRM button
        document.getElementById('send-to-crm').addEventListener('click', () => {
            this.sendToCRM();
        });

        // Settings
        document.getElementById('crm-endpoint').addEventListener('change', (e) => {
            this.saveSetting('crmEndpoint', e.target.value);
        });

        document.getElementById('auto-extract').addEventListener('change', (e) => {
            this.saveSetting('autoExtract', e.target.checked);
        });

        // Footer links
        document.getElementById('open-crm').addEventListener('click', (e) => {
            e.preventDefault();
            this.openCRM();
        });

        document.getElementById('view-help').addEventListener('click', (e) => {
            e.preventDefault();
            this.showHelp();
        });
    }

    async checkCurrentTab() {
        try {
            const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

            if (!tab.url.includes('linkedin.com/in/')) {
                this.showStatus('Navigate to a LinkedIn profile to extract data', 'warning');
                document.getElementById('extract-btn').disabled = true;
                return;
            }

            this.showStatus('Ready to extract LinkedIn profile data', 'ready');

            // Check if data was already extracted
            const result = await chrome.storage.local.get(['linkedinData', 'lastExtracted']);
            if (result.linkedinData && result.lastExtracted) {
                const lastExtracted = new Date(result.lastExtracted);
                const now = new Date();
                const diffMinutes = (now - lastExtracted) / (1000 * 60);

                if (diffMinutes < 5) { // Data is less than 5 minutes old
                    this.extractedData = result.linkedinData;
                    this.displayExtractedData();
                    this.showStatus('Using recently extracted data', 'success');
                }
            }

            // Auto-extract if enabled
            const settings = await chrome.storage.local.get(['autoExtract']);
            if (settings.autoExtract !== false && !this.extractedData) {
                setTimeout(() => this.extractData(), 1000);
            }

        } catch (error) {
            console.error('Error checking current tab:', error);
            this.showStatus('Error checking current page', 'error');
        }
    }

    async extractData() {
        try {
            this.showStatus('Extracting profile data...', 'extracting');
            this.setButtonLoading('extract-btn', true);

            const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

            // Check if we're on a LinkedIn profile page
            if (!tab.url || !tab.url.includes('linkedin.com/in/')) {
                throw new Error('Please navigate to a LinkedIn profile page (linkedin.com/in/...)');
            }

            try {
                // Try to communicate with existing content script
                const response = await chrome.tabs.sendMessage(tab.id, {
                    action: 'extractData'
                });

                if (response && response.success) {
                    this.extractedData = response.data;
                    this.displayExtractedData();
                    this.showStatus('Profile data extracted successfully!', 'success');
                    return;
                }
            } catch (error) {
                console.log('Content script not found, injecting...');

                // Content script not injected, inject it manually
                try {
                    await chrome.scripting.executeScript({
                        target: { tabId: tab.id },
                        files: ['content.js']
                    });

                    // Wait a moment for the script to initialize
                    await new Promise(resolve => setTimeout(resolve, 1000));

                    // Try again
                    const response = await chrome.tabs.sendMessage(tab.id, {
                        action: 'extractData'
                    });

                    if (response && response.success) {
                        this.extractedData = response.data;
                        this.displayExtractedData();
                        this.showStatus('Profile data extracted successfully!', 'success');
                        return;
                    }
                } catch (injectionError) {
                    console.error('Failed to inject content script:', injectionError);
                    throw new Error('Failed to inject content script. Please refresh the page and try again.');
                }
            }

            throw new Error('Failed to extract data from LinkedIn profile');

        } catch (error) {
            console.error('Error extracting data:', error);
            this.showStatus('Error extracting profile data', 'error');
            this.showErrorMessage(error.message || 'Failed to extract profile data. Make sure you\'re on a LinkedIn profile page.');
        } finally {
            this.setButtonLoading('extract-btn', false);
        }
    }

    displayExtractedData() {
        if (!this.extractedData) return;

        // Show data preview
        document.getElementById('data-preview').style.display = 'block';
        document.getElementById('crm-section').style.display = 'block';

        // Populate preview fields
        document.getElementById('preview-name').textContent = this.extractedData.name || '-';
        document.getElementById('preview-job-title').textContent = this.extractedData.jobTitle || '-';
        document.getElementById('preview-company').textContent = this.extractedData.company || '-';
        document.getElementById('preview-location').textContent = this.extractedData.location || '-';
        document.getElementById('preview-connections').textContent = this.extractedData.connections || '-';

        // Pre-fill CRM fields
        document.getElementById('lead-source').value = 'linkedin';

        // Auto-select tags based on extracted data
        if (this.extractedData.jobTitle) {
            const title = this.extractedData.jobTitle.toLowerCase();
            if (title.includes('ceo') || title.includes('founder') || title.includes('president')) {
                document.getElementById('tag-decision-maker').checked = true;
            }
            if (this.extractedData.company && this.extractedData.connections && parseInt(this.extractedData.connections.replace(',', '')) > 500) {
                document.getElementById('tag-enterprise').checked = true;
            }
        }
    }

    async sendToCRM() {
        if (!this.extractedData) {
            this.showErrorMessage('No data to send. Please extract profile data first.');
            return;
        }

        try {
            this.showStatus('Sending to CRM...', 'sending');
            this.setButtonLoading('send-to-crm', true);

            // Get CRM settings
            const crmEndpoint = document.getElementById('crm-endpoint').value;
            const leadSource = document.getElementById('lead-source').value;
            const contactOwner = document.getElementById('contact-owner').value;

            // Get selected tags
            const selectedTags = [];
            document.querySelectorAll('.tag-option input[type="checkbox"]:checked').forEach(checkbox => {
                selectedTags.push(checkbox.value);
            });

            // Prepare contact data for CRM
            const contactData = {
                name: this.extractedData.name,
                jobTitle: this.extractedData.jobTitle,
                company: this.extractedData.company,
                email: this.extractedData.email,
                phone: this.extractedData.phone,
                profileUrl: this.extractedData.profileUrl,
                location: this.extractedData.location,
                about: this.extractedData.about,
                status: 'prospect',
                owner: contactOwner,
                tags: selectedTags,
                leadSource: leadSource,
                decisionRole: this.inferDecisionRole(),
                socialProfiles: {
                    linkedin: this.extractedData.profileUrl
                },
                customFields: {
                    connections: this.extractedData.connections,
                    industry: this.extractedData.industry,
                    extractedAt: this.extractedData.extractedAt
                },
                experience: this.extractedData.experience,
                education: this.extractedData.education,
                skills: this.extractedData.skills,
                companyInfo: this.extractedData.companyInfo
            };

            // Send to CRM API
            const response = await this.sendToCRMAPI(crmEndpoint, contactData);

            if (response.success) {
                this.showStatus('Successfully sent to CRM!', 'success');
                this.showSuccessMessage('Contact added to CRM successfully!');

                // Store success state
                await chrome.storage.local.set({
                    lastCRMSend: new Date().toISOString(),
                    lastSentContact: contactData
                });

                // Reset form after successful send
                setTimeout(() => {
                    document.getElementById('contact-owner').value = '';
                    document.querySelectorAll('.tag-option input[type="checkbox"]').forEach(checkbox => {
                        checkbox.checked = false;
                    });
                }, 2000);

            } else {
                throw new Error(response.error || 'Failed to send to CRM');
            }

        } catch (error) {
            console.error('Error sending to CRM:', error);
            this.showStatus('Error sending to CRM', 'error');
            this.showErrorMessage(`Failed to send to CRM: ${error.message}`);
        } finally {
            this.setButtonLoading('send-to-crm', false);
        }
    }

    async sendToCRMAPI(endpoint, contactData) {
        try {
            const response = await fetch(`${endpoint}/api/contacts`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(contactData)
            });

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            return await response.json();
        } catch (error) {
            // If direct API call fails, try background script
            return new Promise((resolve) => {
                chrome.runtime.sendMessage({
                    action: 'sendToCRM',
                    endpoint: endpoint,
                    data: contactData
                }, (response) => {
                    resolve(response || { success: false, error: error.message });
                });
            });
        }
    }

    inferDecisionRole() {
        if (!this.extractedData.jobTitle) return 'other';

        const title = this.extractedData.jobTitle.toLowerCase();
        if (title.includes('ceo') || title.includes('founder') || title.includes('president') ||
            title.includes('owner') || title.includes('director') || title.includes('vp') ||
            title.includes('head of') || title.includes('chief')) {
            return 'decision-maker';
        }
        if (title.includes('manager') || title.includes('lead') || title.includes('senior')) {
            return 'influencer';
        }
        return 'user';
    }

    showStatus(message, type) {
        const statusText = document.getElementById('status-text');
        const statusDot = document.querySelector('.status-dot');

        statusText.textContent = message;
        statusDot.className = `status-dot ${type}`;
    }

    setButtonLoading(buttonId, loading) {
        const button = document.getElementById(buttonId);
        const text = button.querySelector('span');
        const originalText = text.textContent;

        if (loading) {
            button.disabled = true;
            button.classList.add('loading');
            text.innerHTML = '<span class="loading-spinner"></span> Processing...';
        } else {
            button.disabled = false;
            button.classList.remove('loading');
            text.textContent = originalText;
        }
    }

    showSuccessMessage(message) {
        this.showMessage(message, 'success');
    }

    showErrorMessage(message) {
        this.showMessage(message, 'error');
    }

    showMessage(message, type) {
        // Remove existing messages
        document.querySelectorAll('.success-message, .error-message').forEach(el => el.remove());

        const messageEl = document.createElement('div');
        messageEl.className = `${type}-message`;
        messageEl.textContent = message;

        const mainContent = document.querySelector('.main-content');
        mainContent.insertBefore(messageEl, mainContent.firstChild);

        // Auto-remove after 5 seconds
        setTimeout(() => {
            if (messageEl.parentNode) {
                messageEl.remove();
            }
        }, 5000);
    }

    async loadSettings() {
        try {
            const settings = await chrome.storage.local.get([
                'crmEndpoint',
                'autoExtract'
            ]);

            if (settings.crmEndpoint) {
                document.getElementById('crm-endpoint').value = settings.crmEndpoint;
            }

            if (settings.autoExtract !== undefined) {
                document.getElementById('auto-extract').checked = settings.autoExtract;
            }
        } catch (error) {
            console.error('Error loading settings:', error);
        }
    }

    async saveSetting(key, value) {
        try {
            await chrome.storage.local.set({ [key]: value });
        } catch (error) {
            console.error('Error saving setting:', error);
        }
    }

    async openCRM() {
        try {
            const crmEndpoint = document.getElementById('crm-endpoint').value;
            await chrome.tabs.create({ url: crmEndpoint });
        } catch (error) {
            console.error('Error opening CRM:', error);
        }
    }

    showHelp() {
        const helpContent = `
Xtrawrkx CRM LinkedIn Extractor Help:

1. Navigate to any LinkedIn profile page
2. Click "Extract Profile Data" to extract contact information
3. Review the extracted data in the preview section
4. Select lead source, assign owner, and add tags
5. Click "Send to CRM" to add the contact to your CRM

Settings:
- CRM Endpoint: URL of your CRM system
- Auto-extract: Automatically extract data when visiting LinkedIn profiles

Supported Data:
- Name, job title, company
- Location and profile image
- About/summary section
- Work experience and education
- Skills and connections count

Note: Email and phone numbers are not publicly available on LinkedIn and won't be extracted.
    `;

        alert(helpContent);
    }
}

// Initialize popup when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new PopupManager();
});
