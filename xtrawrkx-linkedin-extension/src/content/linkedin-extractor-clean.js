// LinkedIn Data Extractor - Clean Version
if (typeof window.LinkedInExtractor === 'undefined') {
    class LinkedInExtractor {
        constructor() {
            console.log('🚀 LinkedIn Extractor initialized');
            this.currentPageData = null;
            this.setupExtractor();
        }

        setupExtractor() {
            this.injectToggleButton();
            this.observeUrlChanges();
            this.setupMessageListener();
        }

        injectToggleButton() {
            // Remove existing button
            const existingBtn = document.querySelector('.xtrawrkx-toggle-btn');
            if (existingBtn) {
                existingBtn.remove();
            }

            // Create toggle button
            const toggleBtn = document.createElement('button');
            toggleBtn.className = 'xtrawrkx-toggle-btn';
            toggleBtn.innerHTML = `
                <div class="xtrawrkx-btn-content">
                    <span class="xtrawrkx-btn-text">Xtrawrkx</span>
                </div>
            `;

            // Add click handler
            toggleBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.openSidePanel();
            });

            // Inject into page
            document.body.appendChild(toggleBtn);
            console.log('✅ Toggle button injected');
        }

        openSidePanel() {
            console.log('🔄 Opening sidePanel...');
            
            // Check if extension context is valid
            if (!chrome.runtime?.id) {
                console.error('❌ Extension context invalidated');
                this.showNotification('Extension needs to be reloaded. Please refresh the page.', 'error');
                return;
            }

            // Send message to background script to open sidePanel
            chrome.runtime.sendMessage({
                type: 'OPEN_SIDEPANEL_WITH_GESTURE'
            }, (response) => {
                if (chrome.runtime.lastError) {
                    console.error('❌ Runtime error:', chrome.runtime.lastError);
                    this.showNotification('Failed to open sidebar. Please try clicking the extension icon.', 'error');
                    return;
                }

                if (response && response.success) {
                    console.log('✅ SidePanel opened successfully');
                    // Send current page data to sidebar
                    this.sendPageDataToSidebar();
                } else {
                    console.error('❌ Failed to open sidePanel:', response?.error);
                    this.showNotification(response?.error || 'Failed to open sidebar', 'error');
                }
            });
        }

        observeUrlChanges() {
            let lastUrl = window.location.href;
            
            // Create observer for DOM changes
            const observer = new MutationObserver(() => {
                const currentUrl = window.location.href;
                if (currentUrl !== lastUrl) {
                    console.log('🔄 URL changed:', currentUrl);
                    lastUrl = currentUrl;
                    
                    // Delay extraction to allow page to load
                    setTimeout(() => {
                        this.extractCurrentPageData();
                        this.sendPageDataToSidebar();
                    }, 1500);
                }
            });

            // Start observing
            observer.observe(document.body, {
                childList: true,
                subtree: true
            });

            // Listen for popstate events (back/forward navigation)
            window.addEventListener('popstate', () => {
                setTimeout(() => {
                    this.extractCurrentPageData();
                    this.sendPageDataToSidebar();
                }, 1500);
            });

            // Intercept pushState and replaceState
            const originalPushState = history.pushState;
            const originalReplaceState = history.replaceState;

            history.pushState = function(...args) {
                originalPushState.apply(history, args);
                if (window.LinkedInExtractor) {
                    setTimeout(() => {
                        window.LinkedInExtractor.extractCurrentPageData();
                        window.LinkedInExtractor.sendPageDataToSidebar();
                    }, 1500);
                }
            };

            history.replaceState = function(...args) {
                originalReplaceState.apply(history, args);
                if (window.LinkedInExtractor) {
                    setTimeout(() => {
                        window.LinkedInExtractor.extractCurrentPageData();
                        window.LinkedInExtractor.sendPageDataToSidebar();
                    }, 1500);
                }
            };

            console.log('✅ URL change observer setup complete');
        }

        extractCurrentPageData() {
            try {
                console.log('📊 Extracting current page data...');
                
                const pathname = window.location.pathname;
                let extractedData = null;

                if (pathname.includes('/in/')) {
                    console.log('👤 Extracting profile data...');
                    extractedData = this.extractProfileData();
                } else if (pathname.includes('/company/')) {
                    console.log('🏢 Extracting company data...');
                    extractedData = this.extractCompanyData();
                } else if (pathname.includes('/search/')) {
                    console.log('🔍 Extracting search data...');
                    extractedData = this.extractSearchData();
                } else {
                    console.log('❌ Page type not supported for data extraction');
                    extractedData = null;
                }

                this.currentPageData = extractedData;

                if (extractedData) {
                    console.log('✅ Data extraction successful:', extractedData);
                } else {
                    console.log('⚠️ No data extracted from current page');
                }

                return extractedData;
            } catch (error) {
                console.error('❌ Error extracting page data:', error);
                return null;
            }
        }

        extractProfileData() {
            const selectors = {
                name: [
                    'h1.text-heading-xlarge',
                    'h1.break-words',
                    '.pv-text-details__left-panel h1',
                    '.ph5 h1'
                ],
                headline: [
                    '.text-body-medium.break-words',
                    '.pv-text-details__left-panel .text-body-medium',
                    '.ph5 .text-body-medium'
                ],
                location: [
                    '.text-body-small.inline.t-black--light.break-words',
                    '.pv-text-details__left-panel .text-body-small',
                    '.ph5 .text-body-small'
                ]
            };

            const data = {
                type: 'profile',
                url: window.location.href,
                data: {
                    name: this.getTextBySelectors(selectors.name),
                    headline: this.getTextBySelectors(selectors.headline),
                    location: this.getTextBySelectors(selectors.location),
                    profileUrl: window.location.href,
                    linkedInUrl: window.location.href
                }
            };

            // Extract profile photo
            const profilePhoto = this.getProfilePhoto();
            if (profilePhoto) {
                data.data.profilePhoto = profilePhoto;
            }

            // Extract about section
            const aboutSelectors = [
                '#about ~ * .inline-show-more-text',
                '.pv-about-section .pv-about__summary-text',
                '.pv-about__summary-text .inline-show-more-text__text',
                '[data-field="about"] .inline-show-more-text__text'
            ];
            const about = this.getTextBySelectors(aboutSelectors);
            if (about) {
                data.data.about = about;
                data.data.description = about; // Alias for compatibility
            }

            // Extract ALL experiences and add to profile data
            const allExperiences = this.extractAllExperiences();
            data.data.allExperiences = allExperiences;
            data.data.experienceCount = allExperiences.length;
            
            // Set current experience (first one) for backward compatibility
            if (allExperiences.length > 0) {
                const currentExp = allExperiences[0];
                data.data.currentJobTitle = currentExp.jobTitle;
                data.data.currentCompany = currentExp.company;
                data.data.jobTitle = currentExp.jobTitle; // Alias for compatibility
            }

            console.log('📄 Extracted profile data:', data);
            return data;
        }

        getProfilePhoto() {
            try {
                const selectors = [
                    '.pv-top-card-profile-picture__image',
                    '.profile-photo-edit__preview',
                    '.pv-top-card__photo img',
                    '.presence-entity__image'
                ];

                for (const selector of selectors) {
                    const img = document.querySelector(selector);
                    if (img && img.src && !img.src.includes('data:image') && !img.src.includes('ghost')) {
                        console.log('✅ Profile photo found:', img.src);
                        return img.src;
                    }
                }

                console.log('❌ No profile photo found');
                return null;
            } catch (error) {
                console.error('Error extracting profile photo:', error);
                return null;
            }
        }

        // Extract ALL experiences from the experience section
        extractAllExperiences() {
            try {
                console.log('💼 Extracting ALL experiences...');

                // Method 0: Try the exact structure from user's screenshots - section/div with id="experience"
                const experienceById = document.querySelector('#experience, section#experience, div#experience');
                console.log('Experience section by ID found:', !!experienceById);
                
                if (experienceById) {
                    // Look for ul inside the experience section
                    const experienceList = experienceById.querySelector('ul');
                    console.log('Experience ul found:', !!experienceList);
                    
                    if (experienceList) {
                        // Get ALL li elements
                        const allExperienceItems = experienceList.querySelectorAll('li');
                        console.log('Total experience items found:', allExperienceItems.length);
                        
                        const experiences = [];
                        
                        // Extract data from each experience item
                        for (let idx = 0; idx < allExperienceItems.length; idx++) {
                            const item = allExperienceItems[idx];
                            console.log(`\n=== Extracting Experience ${idx + 1} ===`);
                            
                            const experienceData = this.extractSingleExperience(item, idx);
                            if (experienceData) {
                                experiences.push({
                                    ...experienceData,
                                    index: idx,
                                    isCurrent: idx === 0 // First one is usually current
                                });
                                console.log(`✅ Experience ${idx + 1} extracted:`, experienceData);
                            } else {
                                console.log(`❌ Could not extract Experience ${idx + 1}`);
                            }
                        }
                        
                        console.log(`\n✅ Total experiences extracted: ${experiences.length}`);
                        return experiences;
                    }
                }

                // Fallback methods for other LinkedIn layouts
                return this.extractAllExperiencesFallback();
                
            } catch (error) {
                console.error('Error extracting all experiences:', error);
                return [];
            }
        }

        // Extract data from a single experience item
        extractSingleExperience(experienceItem, index) {
            try {
                console.log(`🔍 Extracting single experience ${index + 1}...`);
                
                let jobTitle = null;
                let company = null;
                let duration = null;
                let location = null;
                
                // Get all spans with aria-hidden="true"
                const allSpans = experienceItem.querySelectorAll('span[aria-hidden="true"]');
                console.log(`Found ${allSpans.length} spans in experience ${index + 1}`);
                
                // Extract job title (usually first meaningful span)
                for (let i = 0; i < allSpans.length; i++) {
                    const span = allSpans[i];
                    const text = span.textContent?.trim();
                    console.log(`  Span ${i}: "${text}"`);
                    
                    if (text && text.length > 2) {
                        // Look for job title patterns
                        if (!jobTitle && (
                            text.toLowerCase().includes('ceo') || 
                            text.toLowerCase().includes('co-founder') || 
                            text.toLowerCase().includes('founder') ||
                            text.toLowerCase().includes('director') ||
                            text.toLowerCase().includes('manager') ||
                            text.toLowerCase().includes('lead') ||
                            text.toLowerCase().includes('head') ||
                            text.toLowerCase().includes('engineer') ||
                            text.toLowerCase().includes('developer') ||
                            text.toLowerCase().includes('analyst') ||
                            text.toLowerCase().includes('consultant') ||
                            text.toLowerCase().includes('specialist') ||
                            text.toLowerCase().includes('coordinator') ||
                            text.toLowerCase().includes('trainee') ||
                            text.toLowerCase().includes('intern') ||
                            text.toLowerCase().includes('mentor') ||
                            text.toLowerCase().includes('expert')
                        )) {
                            jobTitle = text;
                            console.log(`  ✅ Job title found: "${jobTitle}"`);
                        }
                        // Look for company name (avoid locations and dates)
                        else if (!company && text !== jobTitle && 
                                !text.includes('·') && 
                                !text.match(/\d{4}/) && 
                                !text.includes('Full-time') && 
                                !text.includes('Part-time') &&
                                !text.includes('Bengaluru') && 
                                !text.includes('Karnataka') && 
                                !text.includes('India') &&
                                !text.includes('Remote') &&
                                !text.includes('yrs') &&
                                !text.includes('mos') &&
                                !text.includes('Present')) {
                            company = text;
                            console.log(`  ✅ Company found: "${company}"`);
                        }
                        // Look for duration (contains years, months, or Present)
                        else if (!duration && (
                            text.includes('yrs') || 
                            text.includes('mos') || 
                            text.includes('Present') ||
                            text.match(/\d{4}.*\d{4}/) ||
                            text.match(/\d{4}.*Present/)
                        )) {
                            duration = text;
                            console.log(`  ✅ Duration found: "${duration}"`);
                        }
                        // Look for location
                        else if (!location && (
                            text.includes('Bengaluru') || 
                            text.includes('Karnataka') || 
                            text.includes('India') ||
                            text.includes('Remote') ||
                            text.includes(',')
                        )) {
                            location = text;
                            console.log(`  ✅ Location found: "${location}"`);
                        }
                    }
                }
                
                // If we still don't have company, look for it in company-specific spans
                if (!company) {
                    const companySpans = experienceItem.querySelectorAll('.t-14.t-normal span[aria-hidden="true"]');
                    for (const span of companySpans) {
                        const text = span.textContent?.trim();
                        if (text && text !== jobTitle) {
                            company = text.split('·')[0].trim(); // Remove "· Full-time"
                            console.log(`  ✅ Company found in specific span: "${company}"`);
                            break;
                        }
                    }
                }
                
                if (jobTitle || company) {
                    return {
                        jobTitle,
                        company,
                        duration,
                        location
                    };
                }
                
                return null;
                
            } catch (error) {
                console.error(`Error extracting single experience ${index}:`, error);
                return null;
            }
        }

        // Fallback method for other LinkedIn layouts
        extractAllExperiencesFallback() {
            console.log('🔍 Trying fallback methods for experience extraction...');
            
            // Try data-field="experience" approach
            const experienceSection = document.querySelector('[data-field="experience"]');
            if (experienceSection) {
                const experienceItems = experienceSection.querySelectorAll('.pvs-list__outer-container > li');
                console.log('Found experience items (fallback):', experienceItems.length);
                
                const experiences = [];
                for (let idx = 0; idx < experienceItems.length; idx++) {
                    const experienceData = this.extractSingleExperience(experienceItems[idx], idx);
                    if (experienceData) {
                        experiences.push({
                            ...experienceData,
                            index: idx,
                            isCurrent: idx === 0
                        });
                    }
                }
                return experiences;
            }
            
            return [];
        }

        extractCompanyData() {
            const selectors = {
                name: [
                    'h1.org-top-card-summary__title',
                    'h1.t-24.t-black.t-normal',
                    '.org-top-card-summary-info-list h1'
                ],
                industry: [
                    '.org-top-card-summary-info-list__info-item',
                    '.org-page-details__definition-text'
                ],
                website: [
                    'a[data-tracking-control-name="about_website"]',
                    '.org-about-us-organization-description__text a'
                ],
                about: [
                    '.org-about-us-organization-description__text',
                    '.break-words p'
                ],
                employees: [
                    '.org-about-company-module__company-staff-count-range',
                    '.t-black--light.text-align-left'
                ],
                location: [
                    '.org-top-card-summary-info-list .t-black--light',
                    '.org-locations'
                ]
            };

            const data = {
                type: 'company',
                url: window.location.href,
                data: {
                    name: this.getTextBySelectors(selectors.name),
                    companyName: this.getTextBySelectors(selectors.name),
                    industry: this.getTextBySelectors(selectors.industry),
                    about: this.getTextBySelectors(selectors.about),
                    description: this.getTextBySelectors(selectors.about),
                    employees: this.getTextBySelectors(selectors.employees),
                    location: this.getTextBySelectors(selectors.location),
                    companyUrl: window.location.href,
                    linkedInUrl: window.location.href
                }
            };

            // Extract website
            const websiteElement = this.getElementBySelectors(selectors.website);
            if (websiteElement) {
                data.data.website = websiteElement.href;
            }

            console.log('🏢 Extracted company data:', data);
            return data;
        }

        extractSearchData() {
            const searchType = this.getSearchType();
            const results = this.extractSearchResults(searchType);

            return {
                type: 'search',
                searchType: searchType,
                url: window.location.href,
                data: {
                    resultsCount: results.length,
                    results: results.slice(0, 10) // Limit to first 10 results
                }
            };
        }

        getSearchType() {
            const url = window.location.href;
            if (url.includes('people')) return 'people';
            if (url.includes('companies')) return 'companies';
            return 'mixed';
        }

        extractSearchResults(searchType) {
            const results = [];
            const resultCards = document.querySelectorAll('.reusable-search__result-container');
            
            resultCards.forEach((card, index) => {
                if (index >= 10) return; // Limit to 10 results
                
                const result = this.extractSingleSearchResult(card, searchType);
                if (result) {
                    results.push(result);
                }
            });
            
            return results;
        }

        extractSingleSearchResult(card, searchType) {
            try {
                const nameElement = card.querySelector('.entity-result__title-text a');
                const headlineElement = card.querySelector('.entity-result__primary-subtitle');
                const locationElement = card.querySelector('.entity-result__secondary-subtitle');
                
                return {
                    name: nameElement ? nameElement.textContent.trim() : null,
                    headline: headlineElement ? headlineElement.textContent.trim() : null,
                    location: locationElement ? locationElement.textContent.trim() : null,
                    profileUrl: nameElement ? nameElement.href : null,
                    type: searchType
                };
            } catch (error) {
                console.error('Error extracting search result:', error);
                return null;
            }
        }

        getTextBySelectors(selectors) {
            for (const selector of selectors) {
                const element = document.querySelector(selector);
                if (element && element.textContent.trim()) {
                    return element.textContent.trim();
                }
            }
            return null;
        }

        getElementBySelectors(selectors) {
            for (const selector of selectors) {
                const element = document.querySelector(selector);
                if (element) {
                    return element;
                }
            }
            return null;
        }

        sendPageDataToSidebar() {
            if (!chrome.runtime?.id) {
                console.log('❌ Extension context invalidated, cannot send data to sidebar');
                return;
            }

            try {
                const currentUrl = window.location.href;
                const timestamp = Date.now();
                
                chrome.runtime.sendMessage({
                    type: 'PAGE_DATA_FOR_SIDEBAR',
                    data: this.currentPageData,
                    url: currentUrl,
                    timestamp: timestamp
                }, (response) => {
                    if (chrome.runtime.lastError) {
                        if (chrome.runtime.lastError.message.includes('Extension context invalidated')) {
                            console.log('⚠️ Extension context invalidated - this is normal when reloading extension');
                        } else if (chrome.runtime.lastError.message.includes('Could not establish connection')) {
                            console.log('⚠️ Could not establish connection - sidebar may not be open');
                        } else {
                            console.error('❌ Runtime error sending data to sidebar:', chrome.runtime.lastError);
                        }
                        return;
                    }

                    if (response && response.success) {
                        console.log('✅ Page data sent to sidebar successfully');
                    } else {
                        console.log('⚠️ Failed to send page data to sidebar:', response?.error);
                    }
                });
            } catch (error) {
                console.error('❌ Error sending page data to sidebar:', error);
            }
        }

        setupMessageListener() {
            chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
                switch (message.type) {
                    case 'EXTRACT_CURRENT_PAGE':
                        const currentData = this.extractCurrentPageData();
                        sendResponse({
                            success: true,
                            data: currentData
                        });
                        break;

                    case 'GET_CURRENT_PAGE_DATA':
                        sendResponse({
                            success: true,
                            data: this.currentPageData
                        });
                        break;

                    case 'EXTRACT_SEARCH_RESULTS':
                        const searchData = this.extractSearchData();
                        sendResponse({
                            success: true,
                            data: searchData
                        });
                        break;

                    default:
                        sendResponse({ success: false, error: 'Unknown message type' });
                }
            });
        }

        showNotification(message, type = 'info') {
            // Remove existing notification
            const existing = document.querySelector('.xtrawrkx-notification');
            if (existing) {
                existing.remove();
            }

            // Create notification
            const notification = document.createElement('div');
            notification.className = `xtrawrkx-notification ${type}`;
            notification.textContent = message;

            // Append to page
            document.body.appendChild(notification);

            // Auto-remove after 5 seconds
            setTimeout(() => {
                notification.remove();
            }, 5000);
        }
    }

    // Initialize the extractor when the page loads
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            window.LinkedInExtractor = new LinkedInExtractor();
        });
    } else {
        window.LinkedInExtractor = new LinkedInExtractor();
    }
}



