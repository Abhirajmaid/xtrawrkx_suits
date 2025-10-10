// LinkedIn Profile Data Extractor
console.log('Xtrawrkx CRM Content Script Loading...');

// Simple test - remove this after debugging
setTimeout(() => {
    console.log('Content script is running on:', window.location.href);
    if (window.location.href.includes('linkedin.com/in/')) {
        console.log('✅ On LinkedIn profile page');

        // Debug selector testing
        setTimeout(() => {
            console.log('🔍 Testing selectors...');

            // Test name selectors
            const nameSelectors = ['h1.text-heading-xlarge', 'h1[data-generated-suggestion-target]', '.pv-text-details__left-panel h1'];
            nameSelectors.forEach(selector => {
                const element = document.querySelector(selector);
                if (element) {
                    console.log(`✅ Name selector "${selector}": "${element.textContent.trim()}"`);
                } else {
                    console.log(`❌ Name selector "${selector}": not found`);
                }
            });

            // Test company selectors with more detail
            console.log('🔍 Testing company extraction methods...');

            // Test experience section structure
            const experienceSection = document.querySelector('section[data-section="experience"]');
            if (experienceSection) {
                console.log('✅ Found experience section');
                const firstExperience = experienceSection.querySelector('.pvs-list__item--line-separated:first-child');
                if (firstExperience) {
                    console.log('✅ Found first experience item');
                    const allSpans = firstExperience.querySelectorAll('span[aria-hidden="true"]');
                    console.log(`Found ${allSpans.length} spans in first experience:`);
                    allSpans.forEach((span, index) => {
                        console.log(`  Experience Span ${index + 1}: "${span.textContent.trim()}"`);
                    });
                } else {
                    console.log('❌ No first experience item found');
                }
            } else {
                console.log('❌ No experience section found');
            }

            // Test about section
            console.log('🔍 Testing about section extraction...');
            const aboutSection = document.querySelector('section[data-section="summary"]');
            if (aboutSection) {
                console.log('✅ Found about/summary section');
                const aboutText = aboutSection.querySelector('.pv-shared-text-with-see-more');
                if (aboutText) {
                    console.log(`✅ Found about text: "${aboutText.textContent.trim().substring(0, 100)}..."`);
                } else {
                    console.log('❌ No about text found in summary section');
                }
            } else {
                console.log('❌ No summary section found');
            }

            // Test about selectors
            const aboutSelectors = ['.pv-about-section .pv-about__summary-text', '.pv-shared-text-with-see-more'];
            aboutSelectors.forEach(selector => {
                const element = document.querySelector(selector);
                if (element) {
                    console.log(`✅ About selector "${selector}": "${element.textContent.trim().substring(0, 50)}..."`);
                } else {
                    console.log(`❌ About selector "${selector}": not found`);
                }
            });

        }, 3000);
    } else {
        console.log('❌ Not on LinkedIn profile page');
    }
}, 2000);

class LinkedInExtractor {
    constructor() {
        this.profileData = {};
        this.init();
    }

    init() {
        console.log('LinkedInExtractor initializing...');

        // Wait for page to load
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                console.log('DOM loaded, extracting data...');
                this.extractData();
            });
        } else {
            console.log('DOM already loaded, extracting data...');
            this.extractData();
        }

        // Listen for messages from popup
        chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
            console.log('Content script received message:', request);

            if (request.action === 'extractData') {
                try {
                    this.extractData();
                    console.log('Extraction completed, sending response:', this.profileData);
                    sendResponse({ success: true, data: this.profileData });
                } catch (error) {
                    console.error('Error during extraction:', error);
                    sendResponse({ success: false, error: error.message });
                }
            } else if (request.action === 'getExtractedData') {
                sendResponse({ success: true, data: this.profileData });
            } else if (request.action === 'showSidebar') {
                try {
                    this.extractData();
                    this.showSidebar();
                    sendResponse({ success: true });
                } catch (error) {
                    console.error('Error showing sidebar:', error);
                    sendResponse({ success: false, error: error.message });
                }
            }

            return true; // Keep message channel open for async response
        });

        // Add extraction button to LinkedIn page
        setTimeout(() => {
            this.addExtractionButton();
        }, 2000); // Wait 2 seconds for page to fully load
    }

    extractData() {
        try {
            console.log('Extracting LinkedIn profile data...');

            // Check if we're actually on a LinkedIn profile page
            if (!window.location.href.includes('linkedin.com/in/')) {
                throw new Error('Not on a LinkedIn profile page');
            }

            // Basic profile information
            this.profileData = {
                // Name
                name: this.extractName(),

                // Job title and company
                jobTitle: this.extractJobTitle(),
                company: this.extractCompany(),

                // Contact information
                email: null, // LinkedIn doesn't expose emails directly
                phone: null, // LinkedIn doesn't expose phone numbers directly

                // Profile URL
                profileUrl: window.location.href,

                // Profile image
                profileImage: this.extractProfileImage(),

                // Location
                location: this.extractLocation(),

                // About/Summary
                about: this.extractAbout(),

                // Experience
                experience: this.extractExperience(),

                // Education
                education: this.extractEducation(),

                // Skills
                skills: this.extractSkills(),

                // Connection count (if visible)
                connections: this.extractConnections(),

                // Industry (if available)
                industry: this.extractIndustry(),

                // Company information
                companyInfo: this.extractCompanyInfo(),

                // Additional metadata
                extractedAt: new Date().toISOString(),
                source: 'linkedin',
                leadSource: 'linkedin'
            };

            console.log('Extracted data:', this.profileData);

            // Debug logging for key fields
            console.log('🔍 Extraction Debug:');
            console.log('Name:', this.profileData.name);
            console.log('Job Title:', this.profileData.jobTitle);
            console.log('Company:', this.profileData.company);
            console.log('About/Description:', this.profileData.about ? this.profileData.about.substring(0, 100) + '...' : 'None');
            console.log('Location:', this.profileData.location);

            // Validate that we got at least a name
            if (!this.profileData.name) {
                console.warn('No name extracted, trying alternative selectors...');
                // Try some backup selectors
                this.profileData.name = this.extractNameFallback();
            }

            // Store data in Chrome storage
            chrome.storage.local.set({
                linkedinData: this.profileData,
                lastExtracted: new Date().toISOString()
            });

            // Show success notification
            this.showNotification('Profile data extracted successfully!', 'success');

            return this.profileData;

        } catch (error) {
            console.error('Error extracting LinkedIn data:', error);
            this.showNotification('Error extracting profile data: ' + error.message, 'error');
            throw error;
        }
    }

    extractName() {
        const nameSelectors = [
            'h1.text-heading-xlarge',
            'h1[data-generated-suggestion-target]',
            '.pv-text-details__left-panel h1',
            '.ph5.pb5 h1',
            'h1.break-words',
            '.pv-top-card--list li:first-child h1'
        ];

        for (const selector of nameSelectors) {
            const element = document.querySelector(selector);
            if (element && element.textContent.trim()) {
                return element.textContent.trim();
            }
        }
        return null;
    }

    extractNameFallback() {
        // Additional fallback selectors for name extraction
        const fallbackSelectors = [
            'h1',
            '.pv-top-card h1',
            '[data-test-id="profile-name"]',
            '.profile-name',
            '.pv-entity__summary-info h1'
        ];

        for (const selector of fallbackSelectors) {
            const elements = document.querySelectorAll(selector);
            for (const element of elements) {
                const text = element.textContent.trim();
                // Check if this looks like a name (has at least 2 words, not too long)
                if (text && text.split(' ').length >= 2 && text.length < 100 &&
                    !text.toLowerCase().includes('linkedin') &&
                    !text.toLowerCase().includes('profile')) {
                    return text;
                }
            }
        }
        return 'Unknown';
    }

    extractJobTitle() {
        const titleSelectors = [
            '.text-body-medium.break-words',
            '.pv-text-details__left-panel .text-body-medium',
            '.ph5.pb5 .text-body-medium',
            'div[data-generated-suggestion-target] + div .text-body-medium',
            '.pv-top-card--list li .text-body-medium',
            '.mt2 .text-body-medium'
        ];

        for (const selector of titleSelectors) {
            const element = document.querySelector(selector);
            if (element && element.textContent.trim()) {
                const text = element.textContent.trim();
                // Filter out location and connection info
                if (!text.includes('connection') && !text.includes('follower') &&
                    !text.includes('•') && text.length > 3) {
                    return text;
                }
            }
        }
        return null;
    }

    extractCompany() {
        console.log('🔍 Extracting company from Experience section...');

        // Method 1: Look for Experience section with current job
        const experienceSelectors = [
            // New LinkedIn layout
            'section[data-section="experience"] .pvs-list__item--line-separated:first-child',
            'section[data-section="experience"] .pv-profile-section__list-item:first-child',
            // Alternative selectors for experience
            '.experience-section .pv-profile-section__list-item:first-child',
            '.pv-profile-section[data-section="experience"] .pv-profile-section__list-item:first-child',
            // Fallback selectors
            '.pvs-list__item--line-separated:first-child',
            '.pv-entity__summary-info:first-child'
        ];

        for (const selector of experienceSelectors) {
            const experienceItem = document.querySelector(selector);
            if (experienceItem) {
                console.log('Found experience item:', experienceItem);

                // Look for company name in various ways within this experience item
                const companySelectors = [
                    '.pv-entity__secondary-title',
                    '.t-14.t-normal span[aria-hidden="true"]:last-child',
                    '.pv-entity__summary-info h4 span[aria-hidden="true"]',
                    'a[data-field="experience_company_logo"] span[aria-hidden="true"]',
                    '.pv-entity__summary-info .pv-entity__secondary-title',
                    'h4 span[aria-hidden="true"]'
                ];

                for (const companySelector of companySelectors) {
                    const companyElement = experienceItem.querySelector(companySelector);
                    if (companyElement && companyElement.textContent.trim()) {
                        const company = companyElement.textContent.trim();
                        console.log(`✅ Found company via experience "${companySelector}": "${company}"`);
                        return company;
                    }
                }

                // Try to extract from all spans in the experience item
                const allSpans = experienceItem.querySelectorAll('span[aria-hidden="true"]');
                console.log(`Found ${allSpans.length} spans in experience item:`);

                for (let i = 0; i < allSpans.length; i++) {
                    const span = allSpans[i];
                    const text = span.textContent.trim();
                    console.log(`  Span ${i + 1}: "${text}"`);

                    // Skip job titles and look for company names
                    if (text && text.length > 1 &&
                        !text.toLowerCase().includes('ceo') &&
                        !text.toLowerCase().includes('founder') &&
                        !text.toLowerCase().includes('director') &&
                        !text.toLowerCase().includes('manager') &&
                        !text.toLowerCase().includes('lead') &&
                        !text.toLowerCase().includes('senior') &&
                        !text.includes('·') &&
                        !text.includes('•')) {

                        // If this span is after a job title span, it's likely the company
                        if (i > 0) {
                            const prevText = allSpans[i - 1].textContent.trim().toLowerCase();
                            if (prevText.includes('ceo') || prevText.includes('founder') ||
                                prevText.includes('director') || prevText.includes('manager')) {
                                console.log(`✅ Found company after job title: "${text}"`);
                                return text;
                            }
                        }
                    }
                }
            }
        }

        // Method 2: Look for "at company" pattern in job title
        const jobTitleElements = document.querySelectorAll('.text-body-medium');
        for (const element of jobTitleElements) {
            const text = element.textContent.trim();
            const atMatch = text.match(/\bat\s+(.+?)(?:\s*\||$)/i);
            if (atMatch && atMatch[1]) {
                const company = atMatch[1].trim();
                if (company.length > 1) {
                    console.log(`✅ Found company via "at" pattern: "${company}"`);
                    return company;
                }
            }
        }

        console.log('❌ No company found in experience section');
        return null;
    }

    extractProfileImage() {
        const imageSelectors = [
            '.pv-top-card__photo img',
            '.profile-photo-edit__preview img',
            '.pv-top-card-profile-picture__image img'
        ];

        for (const selector of imageSelectors) {
            const element = document.querySelector(selector);
            if (element && element.src) {
                return element.src;
            }
        }
        return null;
    }

    extractLocation() {
        const locationSelectors = [
            '.text-body-small.inline.t-black--light.break-words',
            '.pv-text-details__left-panel .text-body-small',
            '.ph5.pb5 .text-body-small'
        ];

        for (const selector of locationSelectors) {
            const element = document.querySelector(selector);
            if (element && element.textContent.trim()) {
                const text = element.textContent.trim();
                // Filter out connection counts and other non-location text
                if (!text.includes('connection') && !text.includes('follower')) {
                    return text;
                }
            }
        }
        return null;
    }

    extractAbout() {
        console.log('🔍 Extracting About section...');

        const aboutSelectors = [
            // New LinkedIn layout selectors for About section
            'section[data-section="summary"] .pv-shared-text-with-see-more .break-words',
            'section[data-section="summary"] .pv-shared-text-with-see-more',
            'section[data-section="summary"] .inline-show-more-text',
            'section[data-section="summary"] .pv-about__summary-text',

            // Alternative About section selectors
            '.pv-about-section .pv-shared-text-with-see-more .break-words',
            '.pv-about-section .pv-shared-text-with-see-more',
            '.pv-about-section .inline-show-more-text',
            '.pv-about-section .pv-about__summary-text .break-words',
            '.pv-about-section .pv-about__summary-text',

            // More fallback selectors
            '.about-section .pv-about__summary-text .break-words',
            '.about-section .pv-about__summary-text',
            '.about-section .pv-shared-text-with-see-more',

            // Generic selectors for About content
            'section[data-section="summary"] .break-words',
            '.pv-profile-section__card-item-v2 .pv-about__summary-text',
            '[data-section="summary"] .break-words',
            '.summary-section .pv-about__summary-text',
            '.about .pv-about__summary-text'
        ];

        for (const selector of aboutSelectors) {
            const element = document.querySelector(selector);
            if (element && element.textContent.trim()) {
                let text = element.textContent.trim();

                console.log(`Found about text via "${selector}": "${text.substring(0, 100)}..."`);

                // Clean up the text
                text = text.replace(/\s+/g, ' '); // Replace multiple spaces with single space
                text = text.replace(/\n+/g, ' '); // Replace newlines with spaces
                text = text.replace(/\t+/g, ' '); // Replace tabs with spaces

                // Remove "see more" and "see less" text
                text = text.replace(/\.\.\.\s*see more$/i, '');
                text = text.replace(/see less$/i, '');
                text = text.trim();

                // Only return if it's substantial content (more than 20 characters)
                if (text.length > 20) {
                    console.log(`✅ Successfully extracted about section: ${text.length} characters`);
                    return text;
                }
            }
        }

        // Try to find About section by looking for section headers
        const sectionHeaders = document.querySelectorAll('h2, h3');
        for (const header of sectionHeaders) {
            const headerText = header.textContent.trim().toLowerCase();
            if (headerText.includes('about') || headerText === 'summary') {
                console.log('Found About section header:', header);

                // Look for content after this header
                let nextElement = header.nextElementSibling;
                while (nextElement) {
                    const text = nextElement.textContent.trim();
                    if (text && text.length > 20) {
                        console.log(`✅ Found about content after header: "${text.substring(0, 100)}..."`);
                        return text.replace(/\s+/g, ' ').trim();
                    }
                    nextElement = nextElement.nextElementSibling;
                }
            }
        }

        console.log('❌ No About section content found');
        return null;
    }

    extractExperience() {
        const experiences = [];
        const experienceItems = document.querySelectorAll('.pv-profile-section__list-item, .pvs-list__item--line-separated');

        experienceItems.forEach(item => {
            try {
                const titleElement = item.querySelector('h3, .mr1.t-bold span[aria-hidden="true"]');
                const companyElement = item.querySelector('.pv-entity__secondary-title, .t-14.t-normal span[aria-hidden="true"]');
                const durationElement = item.querySelector('.pv-entity__bullet-item, .t-14.t-normal.t-black--light span[aria-hidden="true"]');

                if (titleElement) {
                    experiences.push({
                        title: titleElement.textContent.trim(),
                        company: companyElement ? companyElement.textContent.trim() : null,
                        duration: durationElement ? durationElement.textContent.trim() : null
                    });
                }
            } catch (error) {
                console.log('Error extracting experience item:', error);
            }
        });

        return experiences.slice(0, 5); // Limit to top 5 experiences
    }

    extractEducation() {
        const education = [];
        const educationItems = document.querySelectorAll('.pv-education-section .pv-profile-section__list-item, .education-section .pvs-list__item--line-separated');

        educationItems.forEach(item => {
            try {
                const schoolElement = item.querySelector('h3, .mr1.t-bold span[aria-hidden="true"]');
                const degreeElement = item.querySelector('.pv-entity__degree-info, .t-14.t-normal span[aria-hidden="true"]');

                if (schoolElement) {
                    education.push({
                        school: schoolElement.textContent.trim(),
                        degree: degreeElement ? degreeElement.textContent.trim() : null
                    });
                }
            } catch (error) {
                console.log('Error extracting education item:', error);
            }
        });

        return education.slice(0, 3); // Limit to top 3 education items
    }

    extractSkills() {
        const skills = [];
        const skillElements = document.querySelectorAll('.pv-skill-category-entity__name span, .pvs-list__item--line-separated .mr1.t-bold span[aria-hidden="true"]');

        skillElements.forEach(element => {
            if (element && element.textContent.trim()) {
                skills.push(element.textContent.trim());
            }
        });

        return skills.slice(0, 10); // Limit to top 10 skills
    }

    extractConnections() {
        const connectionSelectors = [
            '.pv-top-card--list-bullet li:first-child',
            '.text-body-small.inline.t-black--light.break-words'
        ];

        for (const selector of connectionSelectors) {
            const element = document.querySelector(selector);
            if (element && element.textContent.includes('connection')) {
                const match = element.textContent.match(/(\d+[\d,]*)\s*connection/i);
                return match ? match[1].replace(',', '') : null;
            }
        }
        return null;
    }

    extractIndustry() {
        // Try to extract industry from company information or experience
        const experienceSection = document.querySelector('.experience-section');
        if (experienceSection) {
            const companyLinks = experienceSection.querySelectorAll('a[href*="/company/"]');
            if (companyLinks.length > 0) {
                // This would require additional API calls to get company industry
                // For now, we'll leave it null and let the CRM user fill it in
            }
        }
        return null;
    }

    extractCompanyInfo() {
        const currentJobTitle = this.extractJobTitle();
        const currentCompany = this.extractCompany();

        if (currentCompany) {
            return {
                name: currentCompany,
                position: currentJobTitle,
                // Additional company info would require separate API calls
                size: null,
                industry: null,
                website: null
            };
        }
        return null;
    }

    addExtractionButton() {
        // Check if button already exists
        if (document.querySelector('#xtrawrkx-extract-btn')) {
            return;
        }

        // Create floating extraction button
        const button = document.createElement('div');
        button.id = 'xtrawrkx-extract-btn';
        button.innerHTML = `
      <div class="xtrawrkx-extract-button">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M2 17L12 22L22 17" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M2 12L12 17L22 12" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        <span>Xtrawrkx CRM</span>
      </div>
    `;

        button.addEventListener('click', () => {
            this.extractData();
            this.showSidebar();
        });

        document.body.appendChild(button);
    }

    showSidebar() {
        // Check if sidebar already exists
        if (document.querySelector('#xtrawrkx-sidebar')) {
            return;
        }

        // Create sidebar container
        const sidebarContainer = document.createElement('div');
        sidebarContainer.id = 'xtrawrkx-sidebar';
        sidebarContainer.style.cssText = `
      position: fixed;
      top: 0;
      right: 0;
      width: 350px;
      height: 100vh;
      z-index: 10000;
      box-shadow: -2px 0 8px rgba(0, 0, 0, 0.1);
      transform: translateX(100%);
      transition: transform 0.3s ease-out;
    `;

        // Create iframe for sidebar content
        const iframe = document.createElement('iframe');
        iframe.src = chrome.runtime.getURL('sidebar.html');
        iframe.style.cssText = `
      width: 100%;
      height: 100%;
      border: none;
      background: white;
    `;

        sidebarContainer.appendChild(iframe);
        document.body.appendChild(sidebarContainer);

        // Animate sidebar in
        setTimeout(() => {
            sidebarContainer.style.transform = 'translateX(0)';
        }, 10);

        // Set up message handling for sidebar
        this.setupSidebarMessaging(iframe);
    }

    setupSidebarMessaging(iframe) {
        // Listen for messages from sidebar
        window.addEventListener('message', (event) => {
            if (event.source !== iframe.contentWindow) return;

            if (event.data.action === 'getProfileData') {
                // Send profile data to sidebar
                iframe.contentWindow.postMessage({
                    action: 'profileDataResponse',
                    data: this.profileData
                }, '*');
            } else if (event.data.action === 'closeSidebar') {
                this.closeSidebar();
            }
        });
    }

    closeSidebar() {
        const sidebar = document.querySelector('#xtrawrkx-sidebar');
        if (sidebar) {
            sidebar.style.transform = 'translateX(100%)';
            setTimeout(() => {
                sidebar.remove();
            }, 300);
        }
    }

    showNotification(message, type = 'info') {
        // Remove existing notification
        const existing = document.querySelector('#xtrawrkx-notification');
        if (existing) {
            existing.remove();
        }

        // Create notification
        const notification = document.createElement('div');
        notification.id = 'xtrawrkx-notification';
        notification.className = `xtrawrkx-notification xtrawrkx-notification--${type}`;
        notification.textContent = message;

        document.body.appendChild(notification);

        // Auto remove after 3 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 3000);
    }
}

// Initialize the extractor
new LinkedInExtractor();
