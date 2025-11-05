/**
 * API Client for XtraWrkx LinkedIn Extension
 * Handles communication with the CRM backend
 */

// Note: Utilities (logger, config, error-handler) are loaded by the service worker via importScripts
// In other contexts (sidebar, options), they are loaded via script tags in HTML

class ExtensionApiClient {
    constructor() {
        this.baseURL = null;
        this.token = null;
        this.initialized = false;
        this.logger = typeof getLogger !== 'undefined' ? getLogger() : null;
        this.config = typeof getConfig !== 'undefined' ? getConfig() : null;
        this.errorHandler = typeof getErrorHandler !== 'undefined' ? getErrorHandler() : null;
    }

    async init() {
        if (this.initialized) return;

        try {
            const config = await chrome.storage.sync.get(['authToken']);
            this.token = config.authToken;

            // Hardcode production URL
            this.baseURL = 'https://xtrawrkxsuits-production.up.railway.app';

            if (this.logger) {
                this.logger.log('API Client initialized with baseURL:', this.baseURL);
            }

            this.initialized = true;
        } catch (error) {
            if (this.logger) {
                this.logger.error('Failed to initialize API client:', error);
            }
            // Fallback to production URL
            this.baseURL = 'https://xtrawrkxsuits-production.up.railway.app';
            this.initialized = true;
        }
    }

    async request(endpoint, options = {}, retryCount = 0) {
        await this.init();

        const url = `${this.baseURL}/api${endpoint}`;
        const requestConfig = {
            headers: {
                'Content-Type': 'application/json',
                ...(this.token && { 'Authorization': `Bearer ${this.token}` }),
                ...options.headers,
            },
            ...options,
        };

        if (requestConfig.body && typeof requestConfig.body === 'object') {
            requestConfig.body = JSON.stringify(requestConfig.body);
        }

        try {
            if (this.logger) {
                this.logger.log('API Request:', url);
            }

            const response = await fetch(url, requestConfig);

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                const errorMessage = errorData.error?.message || `HTTP ${response.status}: ${response.statusText}`;
                const error = new Error(errorMessage);
                error.status = response.status;
                error.code = response.status;

                if (this.logger) {
                    this.logger.error('API Error Response:', response.status, errorMessage);
                }

                throw error;
            }

            const contentType = response.headers.get('content-type');
            if (contentType && contentType.includes('application/json')) {
                const data = await response.json();
                if (this.logger) {
                    this.logger.log('API Response received');
                }
                return data;
            }

            return response;
        } catch (error) {
            if (this.logger) {
                this.logger.error('API Request Failed:', error);
            }

            // Retry logic for network errors
            if (retryCount < 2 && (
                error.message.includes('Failed to fetch') ||
                error.message.includes('NetworkError') ||
                error.code >= 500
            )) {
                if (this.logger) {
                    this.logger.warn(`Retrying request (attempt ${retryCount + 1}/2)...`);
                }
                await this.sleep(1000 * (retryCount + 1)); // Exponential backoff
                return this.request(endpoint, options, retryCount + 1);
            }

            // Use error handler for user-friendly messages
            if (this.errorHandler) {
                const friendlyError = await this.errorHandler.handleApiError(error, { endpoint, url });
                error.userMessage = friendlyError;
            }

            throw error;
        }
    }

    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // Authentication methods
    async authenticate(email, password) {
        try {
            if (this.logger) {
                this.logger.log('Authenticating with:', this.baseURL);
            }

            const response = await this.request('/auth/internal/login', {
                method: 'POST',
                body: { email, password }
            });

            if (response.token && response.user) {
                this.token = response.token;
                await chrome.storage.sync.set({
                    authToken: response.token,
                    userId: response.user.id,
                    userEmail: response.user.email,
                    userName: response.user.name || `${response.user.firstName} ${response.user.lastName}`.trim()
                });
                if (this.logger) {
                    this.logger.log('Authentication successful, token stored');
                }
                return { success: true, user: response.user };
            }

            throw new Error('Invalid response from server');
        } catch (error) {
            if (this.logger) {
                this.logger.error('Authentication error:', error);
            }

            // Use error handler for user-friendly messages
            if (this.errorHandler) {
                const friendlyMessage = await this.errorHandler.handleApiError(error, { operation: 'authentication' });
                error.userMessage = friendlyMessage;
            }

            throw error;
        }
    }

    async verifyAuth() {
        await this.init();

        // Reload token from storage in case it was updated
        const config = await chrome.storage.sync.get(['authToken']);
        if (config.authToken) {
            this.token = config.authToken;
        }

        // If no token, user is not authenticated
        if (!this.token) {
            return false;
        }

        // Since the current-user endpoint doesn't exist, we'll validate the token
        // by checking if it's in the expected format and exists
        // Actual validation will happen on the next API call that requires auth

        // Basic JWT format check (has 3 parts separated by dots)
        const tokenParts = this.token.split('.');
        if (tokenParts.length !== 3) {
            // Invalid token format, clear it
            await this.clearAuth();
            return false;
        }

        // Token exists and has valid format
        // Real validation will happen when making actual API calls
        return true;
    }

    // Lead Company methods
    async createLeadCompany(data) {
        return this.request('/lead-companies', {
            method: 'POST',
            body: { data }
        });
    }

    async checkDuplicateCompany(linkedInUrl) {
        try {
            const queryParams = new URLSearchParams({
                'filters[linkedIn][$eq]': linkedInUrl,
                'pagination[pageSize]': '1'
            });

            const response = await this.request(`/lead-companies?${queryParams}`, {
                method: 'GET'
            });

            return response.data && response.data.length > 0;
        } catch (error) {
            if (this.logger) {
                this.logger.error('Error checking duplicate company:', error);
            }
            return false;
        }
    }

    // Contact methods
    async createContact(data) {
        return this.request('/contacts', {
            method: 'POST',
            body: { data }
        });
    }

    async checkDuplicateContact(email, linkedInUrl) {
        try {
            const filters = [];
            if (email) filters.push(`filters[$or][0][email][$eq]=${encodeURIComponent(email)}`);
            if (linkedInUrl) filters.push(`filters[$or][1][linkedIn][$eq]=${encodeURIComponent(linkedInUrl)}`);

            if (filters.length === 0) return false;

            const queryParams = filters.join('&') + '&pagination[pageSize]=1';
            const response = await this.request(`/contacts?${queryParams}`, {
                method: 'GET'
            });

            return response.data && response.data.length > 0;
        } catch (error) {
            if (this.logger) {
                this.logger.error('Error checking duplicate contact:', error);
            }
            return false;
        }
    }

    async findExistingContact(linkedInUrl) {
        try {
            if (!linkedInUrl) return null;

            if (this.logger) {
                this.logger.log('Finding existing contact for LinkedIn URL:', linkedInUrl);
            }

            const queryParams = new URLSearchParams({
                'filters[linkedIn][$eq]': linkedInUrl,
                'pagination[pageSize]': '1',
                'populate[leadCompany]': 'true',
                'populate[clientAccount]': 'true',
                'populate[account]': 'true',
                'populate[assignedTo]': 'true'
            });

            const response = await this.request(`/contacts?${queryParams}`, {
                method: 'GET'
            });

            if (response.data && response.data.length > 0) {
                const contact = response.data[0];
                if (this.logger) {
                    this.logger.log('Found existing contact');
                }
                return contact;
            }

            return null;
        } catch (error) {
            if (this.logger) {
                this.logger.error('Error finding existing contact:', error);
            }
            return null;
        }
    }

    // Related data methods
    async getContactRelatedData(contactId) {
        try {
            // Fetch deals, tasks, files, activities, and chats in parallel
            const [dealsResponse, tasksResponse, filesResponse, activitiesResponse, chatsResponse] = await Promise.all([
                this.getContactDeals(contactId),
                this.getContactTasks(contactId),
                this.getContactFiles(contactId),
                this.getContactActivities(contactId),
                this.getContactChats(contactId)
            ]);

            const relatedData = {
                deals: dealsResponse,
                tasks: tasksResponse,
                files: filesResponse,
                activities: activitiesResponse,
                chats: chatsResponse
            };

            return relatedData;

        } catch (error) {
            if (this.logger) {
                this.logger.error('Error fetching contact related data:', error);
            }
            throw error;
        }
    }

    async getContactDeals(contactId) {
        try {
            const queryParams = new URLSearchParams({
                'filters[contact][id][$eq]': contactId,
                'populate': '*',
                'sort': 'createdAt:desc',
                'pagination[pageSize]': '10'
            });

            const response = await this.request(`/deals?${queryParams}`, {
                method: 'GET'
            });

            return response.data || [];

        } catch (error) {
            if (this.logger) {
                this.logger.error('Error fetching contact deals:', error);
            }
            return [];
        }
    }

    async getContactTasks(contactId) {
        try {
            // Try multiple filter approaches to ensure we get the right tasks
            const approaches = [
                // Approach 1: Standard Strapi filter
                {
                    name: 'Standard Filter',
                    params: new URLSearchParams({
                        'filters[contact][id][$eq]': contactId,
                        'populate': 'contact',
                        'sort': 'createdAt:desc',
                        'pagination[pageSize]': '50'
                    })
                },
                // Approach 2: Alternative filter syntax
                {
                    name: 'Alternative Filter',
                    params: new URLSearchParams({
                        'filters[contact][$eq]': contactId,
                        'populate': 'contact',
                        'sort': 'createdAt:desc',
                        'pagination[pageSize]': '50'
                    })
                }
            ];

            let allTasks = [];

            for (const approach of approaches) {
                try {
                    const url = `/tasks?${approach.params}`;

                    const response = await this.request(url, {
                        method: 'GET'
                    });

                    if (response.data && response.data.length > 0) {
                        allTasks = response.data;
                        break; // Use the first approach that returns data
                    }
                } catch (error) {
                    if (this.logger) {
                        this.logger.warn(`Filter approach failed:`, error.message);
                    }
                }
            }

            // If no approach worked, try getting all tasks and filter client-side
            if (allTasks.length === 0) {
                try {
                    const response = await this.request('/tasks?populate=contact&pagination[pageSize]=100', {
                        method: 'GET'
                    });
                    allTasks = response.data || [];
                } catch (error) {
                    if (this.logger) {
                        this.logger.error('Fallback approach failed:', error);
                    }
                    return [];
                }
            }

            // Client-side filtering to ensure we only get tasks for this contact
            const filteredTasks = allTasks.filter(task => {
                const taskContactId = task.contact?.id || task.contact;
                return taskContactId == contactId;
            });

            return filteredTasks;

        } catch (error) {
            if (this.logger) {
                this.logger.error('Error fetching contact tasks:', error);
            }
            return [];
        }
    }

    async getContactFiles(contactId) {
        try {
            const queryParams = new URLSearchParams({
                'filters[contact][id][$eq]': contactId,
                'populate': '*',
                'sort': 'createdAt:desc',
                'pagination[pageSize]': '10'
            });

            const response = await this.request(`/files?${queryParams}`, {
                method: 'GET'
            });

            return response.data || [];

        } catch (error) {
            if (this.logger) {
                this.logger.error('Error fetching contact files:', error);
            }
            return [];
        }
    }

    async getContactActivities(contactId) {
        try {
            const queryParams = new URLSearchParams({
                'filters[contact][id][$eq]': contactId,
                'filters[activityType][$in]': 'MEETING,CALL,DEMO',
                'populate': '*',
                'sort': 'scheduledDate:desc',
                'pagination[pageSize]': '10'
            });

            const response = await this.request(`/activities?${queryParams}`, {
                method: 'GET'
            });

            return response.data || [];

        } catch (error) {
            if (this.logger) {
                this.logger.error('Error fetching contact activities:', error);
            }
            return [];
        }
    }

    async getContactChats(contactId) {
        try {
            const queryParams = new URLSearchParams({
                'filters[contact][id][$eq]': contactId,
                'populate': '*',
                'sort': 'createdAt:desc',
                'pagination[pageSize]': '20'
            });

            const response = await this.request(`/chat-messages?${queryParams}`, {
                method: 'GET'
            });

            return response.data || [];

        } catch (error) {
            if (this.logger) {
                this.logger.error('Error fetching contact chats:', error);
            }
            return [];
        }
    }

    async getCompanyData(companyId) {
        try {
            const queryParams = new URLSearchParams({
                'populate[contacts]': 'true',
                'populate[deals]': 'true',
                'populate[accountManager]': 'true',
                'populate[convertedFromLead]': 'true'
            });

            const response = await this.request(`/client-accounts/${companyId}?${queryParams}`, {
                method: 'GET'
            });

            if (response.data) {
                // Mark as client account
                response.data._companyType = 'client';
            }

            return response.data || null;

        } catch (error) {
            if (this.logger) {
                this.logger.error('Error fetching company data:', error);
            }
            return null;
        }
    }

    async getLeadCompanyData(leadCompanyId) {
        try {
            const queryParams = new URLSearchParams({
                'populate[contacts]': 'true',
                'populate[assignedTo]': 'true',
                'populate[convertedAccount]': 'true',
                'populate[deals]': 'true'
            });

            const response = await this.request(`/lead-companies/${leadCompanyId}?${queryParams}`, {
                method: 'GET'
            });

            if (response.data) {
                // Mark as lead company
                response.data._companyType = 'lead';
            }

            return response.data || null;

        } catch (error) {
            if (this.logger) {
                this.logger.error('Error fetching lead company data:', error);
            }
            return null;
        }
    }

    async searchCompanyByName(companyName) {
        try {
            console.log('🔍 Searching for company by name:', companyName);
            
            // First search in lead companies (most companies start as leads)
            const leadQueryParams = new URLSearchParams({
                'filters[companyName][$containsi]': companyName,
                'pagination[pageSize]': '1',
                'populate[contacts]': 'true',
                'populate[assignedTo]': 'true',
                'populate[convertedAccount]': 'true'
            });

            console.log('🔍 Searching lead companies with query:', leadQueryParams.toString());
            const leadResponse = await this.request(`/lead-companies?${leadQueryParams}`, {
                method: 'GET'
            });

            console.log('🔍 Lead companies search result:', leadResponse);

            if (leadResponse.data && leadResponse.data.length > 0) {
                const company = leadResponse.data[0];
                console.log('✅ Found in lead companies:', company);
                company._companyType = 'lead';

                // Check if converted to client account
                if (company.convertedAccount && company.convertedAccount.id) {
                    console.log('🔄 Lead converted to client, fetching client data');
                    return await this.getCompanyData(company.convertedAccount.id);
                }

                return company;
            }

            // If not found in lead companies, search in client accounts
            console.log('🔍 No lead company found, searching client accounts...');
            const clientQueryParams = new URLSearchParams({
                'filters[companyName][$containsi]': companyName,
                'pagination[pageSize]': '1',
                'populate[contacts]': 'true',
                'populate[accountManager]': 'true'
            });

            const clientResponse = await this.request(`/client-accounts?${clientQueryParams}`, {
                method: 'GET'
            });

            console.log('🔍 Client accounts search result:', clientResponse);

            if (clientResponse.data && clientResponse.data.length > 0) {
                const company = clientResponse.data[0];
                console.log('✅ Found in client accounts:', company);
                company._companyType = 'client';
                return company;
            }

            console.log('❌ No company found with name:', companyName);
            return null;

        } catch (error) {
            console.error('❌ Error searching company by name:', error);
            if (this.logger) {
                this.logger.error('Error searching company by name:', error);
            }
            return null;
        }
    }

    // Lead methods
    async createLead(data) {
        return this.request('/leads', {
            method: 'POST',
            body: { data }
        });
    }

    // Utility methods
    async getUserId() {
        const { userId } = await chrome.storage.sync.get(['userId']);
        return userId;
    }

    async getStoredConfig() {
        return chrome.storage.sync.get(['apiBaseUrl', 'authToken', 'userId', 'userEmail', 'userName']);
    }

    async clearAuth() {
        this.token = null;
        await chrome.storage.sync.remove(['authToken', 'userId', 'userEmail', 'userName']);
    }
}

// Export as global for use in different contexts
if (typeof window !== 'undefined') {
    window.ExtensionApiClient = ExtensionApiClient;
}

// Also support module export for service worker
if (typeof self !== 'undefined') {
    self.ExtensionApiClient = ExtensionApiClient;
}

