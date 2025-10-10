// Data validation utilities for LinkedIn extraction
class DataValidator {
    static validateExtractedData(data) {
        const errors = [];
        const warnings = [];

        // Required fields validation
        if (!data.name || data.name.trim().length === 0) {
            errors.push('Name is required but was not extracted');
        }

        // Name format validation
        if (data.name && data.name.length < 2) {
            warnings.push('Name seems too short, please verify');
        }

        if (data.name && data.name.length > 100) {
            warnings.push('Name seems too long, please verify');
        }

        // Email validation
        if (data.email && !this.isValidEmail(data.email)) {
            errors.push('Invalid email format detected');
        }

        // Phone validation
        if (data.phone && !this.isValidPhone(data.phone)) {
            warnings.push('Phone number format may be invalid');
        }

        // URL validation
        if (data.profileUrl && !this.isValidURL(data.profileUrl)) {
            errors.push('Invalid LinkedIn profile URL');
        }

        // Job title validation
        if (data.jobTitle && data.jobTitle.length > 200) {
            warnings.push('Job title seems unusually long');
        }

        // Company validation
        if (data.company && data.company.length > 200) {
            warnings.push('Company name seems unusually long');
        }

        // Location validation
        if (data.location && data.location.length > 100) {
            warnings.push('Location seems unusually long');
        }

        // About section validation
        if (data.about && data.about.length > 5000) {
            warnings.push('About section is very long and may be truncated');
        }

        // Experience validation
        if (data.experience && Array.isArray(data.experience)) {
            data.experience.forEach((exp, index) => {
                if (!exp.title && !exp.company) {
                    warnings.push(`Experience item ${index + 1} is missing title and company`);
                }
            });
        }

        // Skills validation
        if (data.skills && Array.isArray(data.skills)) {
            if (data.skills.length > 50) {
                warnings.push('Large number of skills detected, some may be irrelevant');
            }

            // Check for duplicate skills
            const uniqueSkills = [...new Set(data.skills.map(skill => skill.toLowerCase()))];
            if (uniqueSkills.length !== data.skills.length) {
                warnings.push('Duplicate skills detected and will be removed');
                data.skills = uniqueSkills;
            }
        }

        return {
            isValid: errors.length === 0,
            errors,
            warnings,
            cleanedData: this.cleanData(data)
        };
    }

    static validateCRMData(data) {
        const errors = [];
        const warnings = [];

        // Required CRM fields
        if (!data.name || data.name.trim().length === 0) {
            errors.push('Contact name is required');
        }

        if (!data.owner || data.owner.trim().length === 0) {
            errors.push('Contact owner must be assigned');
        }

        // Email validation
        if (data.email && !this.isValidEmail(data.email)) {
            errors.push('Invalid email address');
        }

        // Phone validation
        if (data.phone && !this.isValidPhone(data.phone)) {
            warnings.push('Phone number format may be invalid');
        }

        // Status validation
        const validStatuses = ['prospect', 'active', 'inactive', 'qualified', 'unqualified'];
        if (data.status && !validStatuses.includes(data.status)) {
            warnings.push(`Status "${data.status}" is not standard, using "prospect"`);
            data.status = 'prospect';
        }

        // Lead source validation
        const validLeadSources = ['linkedin', 'website', 'referral', 'email-campaign', 'conference', 'cold-call', 'social-media'];
        if (data.leadSource && !validLeadSources.includes(data.leadSource)) {
            warnings.push(`Lead source "${data.leadSource}" is not standard`);
        }

        // Decision role validation
        const validDecisionRoles = ['decision-maker', 'influencer', 'user', 'other'];
        if (data.decisionRole && !validDecisionRoles.includes(data.decisionRole)) {
            warnings.push(`Decision role "${data.decisionRole}" is not standard, using "other"`);
            data.decisionRole = 'other';
        }

        // Tags validation
        if (data.tags && Array.isArray(data.tags)) {
            data.tags = data.tags.filter(tag => tag && tag.trim().length > 0);
            if (data.tags.length > 10) {
                warnings.push('Too many tags, consider reducing for better organization');
            }
        }

        return {
            isValid: errors.length === 0,
            errors,
            warnings,
            cleanedData: this.cleanCRMData(data)
        };
    }

    static cleanData(data) {
        const cleaned = { ...data };

        // Clean name
        if (cleaned.name) {
            cleaned.name = cleaned.name.trim().replace(/\s+/g, ' ');
        }

        // Clean job title
        if (cleaned.jobTitle) {
            cleaned.jobTitle = cleaned.jobTitle.trim().replace(/\s+/g, ' ');
        }

        // Clean company
        if (cleaned.company) {
            cleaned.company = cleaned.company.trim().replace(/\s+/g, ' ');
        }

        // Clean location
        if (cleaned.location) {
            cleaned.location = cleaned.location.trim().replace(/\s+/g, ' ');
        }

        // Clean about
        if (cleaned.about) {
            cleaned.about = cleaned.about.trim();
        }

        // Clean email
        if (cleaned.email) {
            cleaned.email = cleaned.email.trim().toLowerCase();
        }

        // Clean phone
        if (cleaned.phone) {
            cleaned.phone = cleaned.phone.trim();
        }

        // Clean arrays
        if (cleaned.skills && Array.isArray(cleaned.skills)) {
            cleaned.skills = cleaned.skills
                .filter(skill => skill && skill.trim().length > 0)
                .map(skill => skill.trim())
                .slice(0, 20); // Limit to 20 skills
        }

        if (cleaned.tags && Array.isArray(cleaned.tags)) {
            cleaned.tags = cleaned.tags
                .filter(tag => tag && tag.trim().length > 0)
                .map(tag => tag.trim().toLowerCase())
                .slice(0, 10); // Limit to 10 tags
        }

        // Clean experience
        if (cleaned.experience && Array.isArray(cleaned.experience)) {
            cleaned.experience = cleaned.experience
                .filter(exp => exp.title || exp.company)
                .map(exp => ({
                    title: exp.title ? exp.title.trim() : null,
                    company: exp.company ? exp.company.trim() : null,
                    duration: exp.duration ? exp.duration.trim() : null
                }))
                .slice(0, 10); // Limit to 10 experiences
        }

        // Clean education
        if (cleaned.education && Array.isArray(cleaned.education)) {
            cleaned.education = cleaned.education
                .filter(edu => edu.school || edu.degree)
                .map(edu => ({
                    school: edu.school ? edu.school.trim() : null,
                    degree: edu.degree ? edu.degree.trim() : null
                }))
                .slice(0, 5); // Limit to 5 education items
        }

        return cleaned;
    }

    static cleanCRMData(data) {
        const cleaned = this.cleanData(data);

        // Ensure required CRM fields have defaults
        if (!cleaned.status) {
            cleaned.status = 'prospect';
        }

        if (!cleaned.leadSource) {
            cleaned.leadSource = 'linkedin';
        }

        if (!cleaned.decisionRole) {
            cleaned.decisionRole = 'other';
        }

        if (!cleaned.tags) {
            cleaned.tags = ['linkedin'];
        }

        // Ensure dates are properly formatted
        if (!cleaned.createdAt) {
            cleaned.createdAt = new Date().toISOString();
        }

        if (!cleaned.lastActivity) {
            cleaned.lastActivity = new Date().toISOString().split('T')[0];
        }

        // Ensure numeric fields are properly typed
        if (cleaned.engagementScore) {
            cleaned.engagementScore = parseInt(cleaned.engagementScore) || 0;
        }

        return cleaned;
    }

    static isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    static isValidPhone(phone) {
        // Remove common formatting characters
        const cleanPhone = phone.replace(/[\s\-\(\)\+]/g, '');
        // Check if it's a reasonable phone number (6-15 digits)
        return /^\d{6,15}$/.test(cleanPhone);
    }

    static isValidURL(url) {
        try {
            const urlObj = new URL(url);
            return urlObj.protocol === 'http:' || urlObj.protocol === 'https:';
        } catch {
            return false;
        }
    }

    static sanitizeInput(input) {
        if (typeof input !== 'string') return input;

        // Remove potentially dangerous characters
        return input
            .replace(/[<>]/g, '') // Remove angle brackets
            .replace(/javascript:/gi, '') // Remove javascript: protocol
            .replace(/on\w+=/gi, '') // Remove event handlers
            .trim();
    }

    static generateValidationReport(validation) {
        const report = [];

        if (!validation.isValid) {
            report.push('❌ Validation Failed');
            validation.errors.forEach(error => {
                report.push(`  • ${error}`);
            });
        } else {
            report.push('✅ Validation Passed');
        }

        if (validation.warnings.length > 0) {
            report.push('\n⚠️ Warnings:');
            validation.warnings.forEach(warning => {
                report.push(`  • ${warning}`);
            });
        }

        return report.join('\n');
    }
}

// Error handling utilities
class ErrorHandler {
    static handleExtractionError(error, context = {}) {
        const errorInfo = {
            message: error.message,
            stack: error.stack,
            context,
            timestamp: new Date().toISOString(),
            type: 'extraction_error'
        };

        console.error('LinkedIn extraction error:', errorInfo);

        // Store error for debugging
        this.logError(errorInfo);

        return {
            success: false,
            error: this.getUserFriendlyMessage(error),
            details: errorInfo
        };
    }

    static handleCRMError(error, context = {}) {
        const errorInfo = {
            message: error.message,
            stack: error.stack,
            context,
            timestamp: new Date().toISOString(),
            type: 'crm_error'
        };

        console.error('CRM integration error:', errorInfo);

        // Store error for debugging
        this.logError(errorInfo);

        return {
            success: false,
            error: this.getUserFriendlyMessage(error),
            details: errorInfo
        };
    }

    static getUserFriendlyMessage(error) {
        const message = error.message.toLowerCase();

        if (message.includes('network') || message.includes('fetch')) {
            return 'Network connection error. Please check your internet connection and try again.';
        }

        if (message.includes('cors')) {
            return 'Cross-origin request blocked. Please check your CRM endpoint configuration.';
        }

        if (message.includes('unauthorized') || message.includes('401')) {
            return 'Authentication failed. Please check your CRM credentials.';
        }

        if (message.includes('forbidden') || message.includes('403')) {
            return 'Access denied. You may not have permission to perform this action.';
        }

        if (message.includes('not found') || message.includes('404')) {
            return 'CRM endpoint not found. Please check your CRM URL configuration.';
        }

        if (message.includes('timeout')) {
            return 'Request timed out. The CRM system may be slow or unavailable.';
        }

        if (message.includes('linkedin')) {
            return 'Unable to extract data from LinkedIn. The page structure may have changed.';
        }

        // Generic error message
        return 'An unexpected error occurred. Please try again or contact support if the problem persists.';
    }

    static async logError(errorInfo) {
        try {
            // Store in Chrome storage for debugging
            const { errorLog = [] } = await chrome.storage.local.get(['errorLog']);

            errorLog.unshift(errorInfo);

            // Keep only last 50 errors
            if (errorLog.length > 50) {
                errorLog.splice(50);
            }

            await chrome.storage.local.set({ errorLog });
        } catch (storageError) {
            console.error('Failed to log error:', storageError);
        }
    }

    static async getErrorLog() {
        try {
            const { errorLog = [] } = await chrome.storage.local.get(['errorLog']);
            return errorLog;
        } catch (error) {
            console.error('Failed to retrieve error log:', error);
            return [];
        }
    }

    static async clearErrorLog() {
        try {
            await chrome.storage.local.set({ errorLog: [] });
        } catch (error) {
            console.error('Failed to clear error log:', error);
        }
    }
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { DataValidator, ErrorHandler };
} else if (typeof window !== 'undefined') {
    window.DataValidator = DataValidator;
    window.ErrorHandler = ErrorHandler;
}


