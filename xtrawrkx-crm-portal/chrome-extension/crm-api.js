// CRM API Integration for Chrome Extension
class CRMAPIClient {
    constructor(baseURL) {
        this.baseURL = baseURL.replace(/\/$/, ''); // Remove trailing slash
        this.headers = {
            'Content-Type': 'application/json',
            'User-Agent': 'Xtrawrkx-CRM-Extension/1.0.0'
        };
    }

    async createContact(contactData) {
        try {
            const response = await fetch(`${this.baseURL}/api/contacts`, {
                method: 'POST',
                headers: this.headers,
                body: JSON.stringify(this.formatContactData(contactData))
            });

            if (!response.ok) {
                const errorData = await response.text();
                throw new Error(`HTTP ${response.status}: ${errorData}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Error creating contact:', error);
            throw error;
        }
    }

    async checkDuplicate(email, linkedinUrl) {
        try {
            const params = new URLSearchParams();
            if (email) params.append('email', email);
            if (linkedinUrl) params.append('linkedin', linkedinUrl);

            const response = await fetch(`${this.baseURL}/api/contacts/check-duplicate?${params}`, {
                method: 'GET',
                headers: this.headers
            });

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Error checking duplicate:', error);
            return { isDuplicate: false }; // Assume no duplicate on error
        }
    }

    async getContactOwners() {
        try {
            const response = await fetch(`${this.baseURL}/api/users`, {
                method: 'GET',
                headers: this.headers
            });

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            const users = await response.json();
            return users.map(user => ({
                value: user.name || user.email,
                label: user.name || user.email
            }));
        } catch (error) {
            console.error('Error fetching contact owners:', error);
            // Return default owners if API fails
            return [
                { value: "John Smith", label: "John Smith" },
                { value: "Jane Doe", label: "Jane Doe" },
                { value: "Mike Johnson", label: "Mike Johnson" },
                { value: "Sarah Wilson", label: "Sarah Wilson" },
                { value: "Alex Brown", label: "Alex Brown" }
            ];
        }
    }

    formatContactData(rawData) {
        // Transform LinkedIn extracted data to CRM format
        return {
            // Basic information
            name: rawData.name,
            jobTitle: rawData.jobTitle,
            company: rawData.company,
            email: rawData.email || null,
            phone: rawData.phone || null,

            // Contact details
            status: 'prospect',
            owner: rawData.owner || '',
            tags: rawData.tags || ['linkedin'],
            leadSource: rawData.leadSource || 'linkedin',
            decisionRole: rawData.decisionRole || this.inferDecisionRole(rawData.jobTitle),

            // Location and profile
            location: rawData.location,
            profileImage: rawData.profileImage,
            about: rawData.about,

            // Social profiles
            socialProfiles: {
                linkedin: rawData.profileUrl,
                ...rawData.socialProfiles
            },

            // Professional information
            experience: rawData.experience || [],
            education: rawData.education || [],
            skills: rawData.skills || [],

            // Company information
            companyInfo: rawData.companyInfo,

            // Metadata
            source: 'chrome-extension',
            extractedAt: rawData.extractedAt || new Date().toISOString(),
            createdAt: new Date().toISOString(),

            // Custom fields
            customFields: {
                connections: rawData.connections,
                industry: rawData.industry,
                linkedinUrl: rawData.profileUrl,
                extractionMethod: 'chrome-extension',
                ...rawData.customFields
            },

            // Additional CRM fields
            engagementScore: 0,
            lastActivity: new Date().toISOString().split('T')[0],
            notes: this.generateInitialNotes(rawData)
        };
    }

    inferDecisionRole(jobTitle) {
        if (!jobTitle) return 'other';

        const title = jobTitle.toLowerCase();
        const decisionMakerKeywords = [
            'ceo', 'founder', 'president', 'owner', 'director', 'vp', 'vice president',
            'head of', 'chief', 'principal', 'partner', 'executive'
        ];

        const influencerKeywords = [
            'manager', 'lead', 'senior', 'supervisor', 'coordinator', 'specialist'
        ];

        if (decisionMakerKeywords.some(keyword => title.includes(keyword))) {
            return 'decision-maker';
        }

        if (influencerKeywords.some(keyword => title.includes(keyword))) {
            return 'influencer';
        }

        return 'user';
    }

    generateInitialNotes(data) {
        const notes = [];

        notes.push(`Contact imported from LinkedIn on ${new Date().toLocaleDateString()}`);

        if (data.connections) {
            notes.push(`LinkedIn connections: ${data.connections}`);
        }

        if (data.about) {
            notes.push(`LinkedIn summary: ${data.about.substring(0, 200)}${data.about.length > 200 ? '...' : ''}`);
        }

        if (data.experience && data.experience.length > 0) {
            notes.push(`Current role: ${data.experience[0].title} at ${data.experience[0].company}`);
        }

        if (data.skills && data.skills.length > 0) {
            notes.push(`Key skills: ${data.skills.slice(0, 5).join(', ')}`);
        }

        return notes.join('\n\n');
    }

    validateContactData(data) {
        const errors = [];

        if (!data.name || data.name.trim().length === 0) {
            errors.push('Contact name is required');
        }

        if (!data.owner || data.owner.trim().length === 0) {
            errors.push('Contact owner is required');
        }

        if (data.email && !this.isValidEmail(data.email)) {
            errors.push('Invalid email format');
        }

        if (data.phone && !this.isValidPhone(data.phone)) {
            errors.push('Invalid phone format');
        }

        return {
            isValid: errors.length === 0,
            errors: errors
        };
    }

    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    isValidPhone(phone) {
        // Basic phone validation - adjust as needed
        const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
        const cleanPhone = phone.replace(/[\s\-\(\)]/g, '');
        return phoneRegex.test(cleanPhone);
    }

    async testConnection() {
        try {
            const response = await fetch(`${this.baseURL}/api/health`, {
                method: 'GET',
                headers: this.headers
            });

            return {
                success: response.ok,
                status: response.status,
                message: response.ok ? 'Connection successful' : 'Connection failed'
            };
        } catch (error) {
            return {
                success: false,
                status: 0,
                message: error.message
            };
        }
    }
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CRMAPIClient;
} else if (typeof window !== 'undefined') {
    window.CRMAPIClient = CRMAPIClient;
}


