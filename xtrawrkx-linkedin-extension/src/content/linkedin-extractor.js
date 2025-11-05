// LinkedIn Data Extractor - Production Ready Version
if (typeof window.LinkedInExtractor === 'undefined') {
    class LinkedInExtractor {
        constructor() {
            this.logger = typeof getLogger !== 'undefined' ? getLogger() : null;
            if (this.logger) {
                this.logger.log('LinkedIn Extractor initialized');
            }
            this.currentPageData = null;
            this.setupExtractor();
        }

        setupExtractor() {
            this.injectToggleButton();
            this.observeUrlChanges();
            this.setupMessageListener();

            // Extract data immediately on load
            setTimeout(() => {
                if (this.logger) {
                    this.logger.log('Initial data extraction on page load...');
                }
                this.extractCurrentPageData();
                this.sendPageDataToSidebar();
            }, 2000);
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
            if (this.logger) {
                this.logger.log('Toggle button injected');
            }
        }

        openSidePanel() {
            if (this.logger) {
                this.logger.log('Opening sidePanel...');
            }

            // Check if extension context is valid
            if (!chrome.runtime?.id) {
                if (this.logger) {
                    this.logger.error('Extension context invalidated');
                }
                this.showNotification('Extension needs to be reloaded. Please refresh the page.', 'error');
                return;
            }

            // Send message to background script to open sidePanel
            chrome.runtime.sendMessage({
                type: 'OPEN_SIDEPANEL_WITH_GESTURE'
            }, (response) => {
                if (chrome.runtime.lastError) {
                    if (this.logger) {
                        this.logger.error('Runtime error:', chrome.runtime.lastError);
                    }
                    this.showNotification('Failed to open sidebar. Please try clicking the extension icon.', 'error');
                    return;
                }

                if (response && response.success) {
                    if (this.logger) {
                        this.logger.log('SidePanel opened successfully');
                    }
                    // Send current page data to sidebar
                    this.sendPageDataToSidebar();
                } else {
                    if (this.logger) {
                        this.logger.error('Failed to open sidePanel:', response?.error);
                    }
                    this.showNotification(response?.error || 'Failed to open sidebar', 'error');
                }
            });
        }

        observeUrlChanges() {
            let lastUrl = window.location.href;
            let urlChangeTimeout;

            // Create observer for DOM changes
            const observer = new MutationObserver(() => {
                const currentUrl = window.location.href;
                if (currentUrl !== lastUrl) {
                    if (this.logger) {
                        this.logger.log('URL changed from:', lastUrl, 'to:', currentUrl);
                    }
                    lastUrl = currentUrl;

                    // Clear previous data
                    this.currentPageData = null;

                    // Debounce URL changes
                    clearTimeout(urlChangeTimeout);
                    urlChangeTimeout = setTimeout(() => {
                        if (this.logger) {
                            this.logger.log('Starting data extraction after URL change...');
                        }
                        this.extractCurrentPageData();
                        this.sendPageDataToSidebar();
                    }, 1500);
                }
            });

            // Start observing with more specific options for better performance
            observer.observe(document.body, {
                childList: true,
                subtree: false // Only observe direct children for better performance
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

            history.pushState = function (...args) {
                originalPushState.apply(history, args);
                if (window.LinkedInExtractor) {
                    setTimeout(() => {
                        window.LinkedInExtractor.extractCurrentPageData();
                        window.LinkedInExtractor.sendPageDataToSidebar();
                    }, 1500);
                }
            };

            history.replaceState = function (...args) {
                originalReplaceState.apply(history, args);
                if (window.LinkedInExtractor) {
                    setTimeout(() => {
                        window.LinkedInExtractor.extractCurrentPageData();
                        window.LinkedInExtractor.sendPageDataToSidebar();
                    }, 1500);
                }
            };

            if (this.logger) {
                this.logger.log('URL change observer setup complete');
            }
        }

        extractCurrentPageData() {
            try {
                const pathname = window.location.pathname;
                let extractedData = null;

                if (pathname.includes('/in/')) {
                    if (this.logger) {
                        this.logger.log('Extracting profile data...');
                    }
                    extractedData = this.extractProfileData();
                } else if (pathname.includes('/company/')) {
                    if (this.logger) {
                        this.logger.log('Extracting company data...');
                    }
                    extractedData = this.extractCompanyData();
                } else if (pathname.includes('/search/')) {
                    if (this.logger) {
                        this.logger.log('Extracting search data...');
                    }
                    extractedData = this.extractSearchData();
                }

                this.currentPageData = extractedData;

                if (extractedData && this.logger) {
                    this.logger.log('Data extraction successful');
                }

                return extractedData;
            } catch (error) {
                if (this.logger) {
                    this.logger.error('Error extracting page data:', error);
                }
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

            // Extract about section - description is in a sibling element after div#about
            const about = this.extractAboutSection();
            if (about) {
                data.data.about = about;
                data.data.description = about; // Alias for compatibility
                console.log('✅ About/description extracted:', about.substring(0, 100) + '...');
            } else {
                console.log('⚠️ About/description not found');
            }

            // Extract ALL experiences and add to profile data
            const allExperiences = this.extractAllExperiences();
            data.data.allExperiences = allExperiences;
            data.data.experienceCount = allExperiences.length;

            // Set current experience (first one) for backward compatibility
            if (allExperiences.length > 0) {
                const currentExp = allExperiences[0];
                data.data.currentJobTitle = currentExp.jobTitle;
                data.data.currentCompany = currentExp.company || currentExp.companyName || '';
                data.data.jobTitle = currentExp.jobTitle; // Alias for compatibility

                console.log('🏢 Current company set from first experience:', data.data.currentCompany);
                console.log('🏢 First experience data:', currentExp);
            } else {
                console.log('⚠️ No experiences found - currentCompany will not be set');
            }

            console.log('📄 Extracted profile data:', data);

            // Debug: Show what name was extracted
            console.log('👤 Profile name extracted:', data.data.name);
            console.log('💼 All experiences extracted:', data.data.allExperiences);

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

        // Extract about/description section - description is in a sibling element after div#about
        extractAboutSection() {
            try {
                console.log('📝 Extracting about/description section...');

                // Method 1: Find div#about and look for description in sibling elements
                const aboutDiv = document.querySelector('div#about');
                if (aboutDiv) {
                    console.log('✅ Found div#about');

                    // Look for the description in sibling elements after div#about
                    // The description is in a span[aria-hidden="true"] within a div with -webkit-line-clamp style
                    let currentElement = aboutDiv.nextElementSibling;
                    let attempts = 0;

                    // Check up to 10 siblings
                    while (currentElement && attempts < 10) {
                        console.log(`🔍 Checking sibling ${attempts + 1}:`, currentElement.tagName, currentElement.className.substring(0, 50));

                        // Look for span[aria-hidden="true"] with description text
                        const descriptionSpan = currentElement.querySelector('span[aria-hidden="true"]');
                        if (descriptionSpan && descriptionSpan.textContent && descriptionSpan.textContent.trim().length > 50) {
                            const text = descriptionSpan.textContent.trim();
                            console.log('✅ Found description in span[aria-hidden="true"]:', text.substring(0, 100) + '...');
                            return text;
                        }

                        // Also check for div with -webkit-line-clamp style (another indicator)
                        const lineClampDiv = currentElement.querySelector('div[style*="-webkit-line-clamp"]');
                        if (lineClampDiv) {
                            const text = lineClampDiv.textContent?.trim();
                            if (text && text.length > 50) {
                                console.log('✅ Found description in div with -webkit-line-clamp:', text.substring(0, 100) + '...');
                                return text;
                            }
                        }

                        // Check if the element itself has the description
                        if (currentElement.textContent && currentElement.textContent.trim().length > 50) {
                            // Look for span[aria-hidden="true"] within this element
                            const spans = currentElement.querySelectorAll('span[aria-hidden="true"]');
                            for (const span of spans) {
                                const text = span.textContent?.trim();
                                if (text && text.length > 50 && !text.includes('Show more') && !text.includes('Show less')) {
                                    console.log('✅ Found description in nested span:', text.substring(0, 100) + '...');
                                    return text;
                                }
                            }
                        }

                        currentElement = currentElement.nextElementSibling;
                        attempts++;
                    }
                } else {
                    console.log('❌ div#about not found');
                }

                // Method 2: Fallback to old selectors
                console.log('🔍 Trying fallback selectors...');
                const fallbackSelectors = [
                    '#about ~ * span[aria-hidden="true"]',
                    '#about ~ * .inline-show-more-text span[aria-hidden="true"]',
                    '.pv-about-section .pv-about__summary-text',
                    '.pv-about__summary-text .inline-show-more-text__text',
                    '[data-field="about"] .inline-show-more-text__text',
                    'div[style*="-webkit-line-clamp"] span[aria-hidden="true"]'
                ];

                for (const selector of fallbackSelectors) {
                    const element = document.querySelector(selector);
                    if (element && element.textContent && element.textContent.trim().length > 50) {
                        const text = element.textContent.trim();
                        if (!text.includes('Show more') && !text.includes('Show less')) {
                            console.log(`✅ Found description with fallback selector "${selector}":`, text.substring(0, 100) + '...');
                            return text;
                        }
                    }
                }

                console.log('❌ No about/description found');
                return null;
            } catch (error) {
                console.error('Error extracting about section:', error);
                return null;
            }
        }

        // Extract ALL experiences from the experience section
        extractAllExperiences() {
            try {
                console.log('💼 Extracting ALL experiences...');
                console.log('💼 Current URL:', window.location.href);
                console.log('💼 Page title:', document.title);

                // Debug: Check what experience-related elements exist on the page
                console.log('🔍 Checking for experience elements...');
                const experienceElements = document.querySelectorAll('*[id*="experience"], *[class*="experience"]');
                console.log('🔍 Found potential experience elements:', experienceElements.length);
                experienceElements.forEach((el, i) => {
                    console.log(`  Element ${i}:`, el.tagName, el.id, el.className.substring(0, 50));
                });

                // Also check for sections with "Experience" text
                const allSections = document.querySelectorAll('section, div');
                let experienceTextSections = 0;
                allSections.forEach(section => {
                    if (section.textContent && section.textContent.toLowerCase().includes('experience')) {
                        experienceTextSections++;
                        if (experienceTextSections <= 3) { // Log first 3 only
                            console.log(`🔍 Section with "experience" text:`, section.tagName, section.id, section.className.substring(0, 50));
                        }
                    }
                });
                console.log('🔍 Total sections with "experience" text:', experienceTextSections);

                // Method 0: Target the exact structure - div#experience + sibling div with specific class > ul > li
                const experienceDiv = document.querySelector('div#experience');
                console.log('Experience div with id="experience" found:', !!experienceDiv);

                if (experienceDiv) {
                    console.log('Experience div HTML preview:', experienceDiv.innerHTML.substring(0, 200) + '...');

                    // Look for the sibling div that contains the actual experience list
                    // The ul is not inside #experience div, but in a sibling div after it
                    const experienceContainer = experienceDiv.nextElementSibling;
                    console.log('Experience container (next sibling) found:', !!experienceContainer);

                    if (experienceContainer) {
                        console.log('Experience container class:', experienceContainer.className);
                        console.log('Experience container HTML preview:', experienceContainer.innerHTML.substring(0, 300) + '...');

                        // Look for ul inside the container div
                        const experienceList = experienceContainer.querySelector('ul');
                        console.log('Experience ul found in container:', !!experienceList);

                        if (experienceList) {
                            console.log('Experience ul class:', experienceList.className);
                            console.log('Experience ul HTML preview:', experienceList.innerHTML.substring(0, 300) + '...');

                            // Get ALL li elements
                            const allExperienceItems = experienceList.querySelectorAll('li');
                            console.log('Total experience li items found:', allExperienceItems.length);

                            // Debug: Show first few li elements
                            for (let i = 0; i < Math.min(allExperienceItems.length, 3); i++) {
                                const li = allExperienceItems[i];
                                console.log(`Experience li ${i + 1} HTML preview:`, li.innerHTML.substring(0, 200) + '...');
                            }

                            const experiences = [];

                            // Extract data from each experience item (handle grouped company positions)
                            let validExperienceIndex = 0;
                            let currentCompanyGroup = null;

                            for (let idx = 0; idx < allExperienceItems.length; idx++) {
                                const item = allExperienceItems[idx];
                                console.log(`\n=== Analyzing Experience Item ${idx + 1} ===`);

                                // Check if this is a company header (multiple positions at same company)
                                if (this.isCompanyHeader(item)) {
                                    currentCompanyGroup = this.extractCompanyFromHeader(item);
                                    console.log(`🏢 Company header detected: ${currentCompanyGroup?.name}`);
                                    // Reset company group if extraction failed
                                    if (!currentCompanyGroup || !currentCompanyGroup.name) {
                                        console.log(`❌ Company header extraction failed, resetting group`);
                                        currentCompanyGroup = null;
                                    }
                                    continue;
                                }

                                // Check if this is a job description (skip it)
                                if (this.isJobDescription(item)) {
                                    console.log(`⏭️ Skipping item ${idx + 1} - job description detected`);
                                    continue;
                                }

                                console.log(`🎯 Processing as job position ${validExperienceIndex + 1}`);
                                const experienceData = this.extractSingleExperience(item, validExperienceIndex, currentCompanyGroup);
                                if (experienceData) {
                                    experiences.push({
                                        ...experienceData,
                                        index: validExperienceIndex,
                                        isCurrent: validExperienceIndex === 0 // First valid experience is current
                                    });
                                    console.log(`✅ Experience ${validExperienceIndex + 1} extracted:`, experienceData);
                                    validExperienceIndex++;
                                } else {
                                    console.log(`❌ Could not extract data from item ${idx + 1}`);
                                }
                            }

                            console.log(`\n✅ Total experiences extracted: ${experiences.length}`);
                            return experiences;
                        }
                    }
                }

                // Method 0.5: If nextElementSibling doesn't work, try to find any sibling div with ul
                console.log('🔍 Method 0.5: Looking for any sibling div with ul after #experience...');
                if (experienceDiv) {
                    let sibling = experienceDiv.nextElementSibling;
                    let attempts = 0;

                    while (sibling && attempts < 5) { // Check up to 5 siblings
                        console.log(`Checking sibling ${attempts + 1}:`, sibling.tagName, sibling.className.substring(0, 50));

                        const ul = sibling.querySelector('ul');
                        if (ul) {
                            console.log('✅ Found ul in sibling', attempts + 1);
                            const lis = ul.querySelectorAll('li');
                            console.log('Li elements found:', lis.length);

                            if (lis.length > 0) {
                                console.log('🎯 Using sibling method for experience extraction');

                                const experiences = [];
                                let validExperienceIndex = 0;
                                let currentCompanyGroup = null;

                                for (let idx = 0; idx < lis.length; idx++) {
                                    const item = lis[idx];
                                    console.log(`\n=== Analyzing Experience Item ${idx + 1} (sibling method) ===`);

                                    // Check if this is a company header (multiple positions at same company)
                                    if (this.isCompanyHeader(item)) {
                                        currentCompanyGroup = this.extractCompanyFromHeader(item);
                                        console.log(`🏢 Company header detected: ${currentCompanyGroup?.name}`);
                                        // Reset company group if extraction failed
                                        if (!currentCompanyGroup || !currentCompanyGroup.name) {
                                            console.log(`❌ Company header extraction failed, resetting group`);
                                            currentCompanyGroup = null;
                                        }
                                        continue;
                                    }

                                    // Check if this is a job description (skip it)
                                    if (this.isJobDescription(item)) {
                                        console.log(`⏭️ Skipping item ${idx + 1} - job description detected`);
                                        continue;
                                    }

                                    console.log(`🎯 Processing as job position ${validExperienceIndex + 1}`);
                                    const experienceData = this.extractSingleExperience(item, validExperienceIndex, currentCompanyGroup);
                                    if (experienceData) {
                                        experiences.push({
                                            ...experienceData,
                                            index: validExperienceIndex,
                                            isCurrent: validExperienceIndex === 0
                                        });
                                        console.log(`✅ Experience ${validExperienceIndex + 1} extracted:`, experienceData);
                                        validExperienceIndex++;
                                    }
                                }

                                if (experiences.length > 0) {
                                    console.log(`\n✅ Total experiences extracted (sibling method): ${experiences.length}`);
                                    return experiences;
                                }
                            }
                        }

                        sibling = sibling.nextElementSibling;
                        attempts++;
                    }
                }

                // Fallback methods for other LinkedIn layouts
                return this.extractAllExperiencesFallback();

            } catch (error) {
                console.error('Error extracting all experiences:', error);
                return [];
            }
        }

        // Check if an experience item is a company header (for multiple positions at same company)
        isCompanyHeader(experienceItem) {
            try {
                const className = experienceItem.className || '';
                console.log(`🔍 Checking if company header - class: "${className.substring(0, 100)}..."`);

                // Look for company header indicators in pvs-entity__sub-components
                if (className.includes('pvs-entity__sub-components')) {
                    const textContent = experienceItem.textContent || '';
                    const textLength = textContent.trim().length;
                    console.log(`Text content preview: "${textContent.substring(0, 100)}..."`);
                    console.log(`Text length: ${textLength} characters`);

                    // Check if it contains company logo/name but no job title
                    const hasCompanyLogo = experienceItem.querySelector('img') ||
                        experienceItem.querySelector('.entity-image');
                    const hasJobTitle = experienceItem.querySelector('.mr1.hoverable-link-text.t-bold') ||
                        experienceItem.querySelector('.t-16.t-black.t-bold');

                    console.log(`Has company logo: ${!!hasCompanyLogo}`);
                    console.log(`Has job title: ${!!hasJobTitle}`);

                    // Company headers have:
                    // 1. Company logo
                    // 2. Short text (< 300 chars)
                    // 3. Duration pattern (yrs/mos)
                    // 4. No job title structure
                    // 5. Often contains dates after company name

                    if (hasCompanyLogo && !hasJobTitle && textLength < 300) {
                        // Check for duration pattern (company headers have duration info)
                        const hasDuration = textContent.includes('yrs') || textContent.includes('mos') ||
                            textContent.includes('year') || textContent.includes('month');

                        if (hasDuration) {
                            console.log('✅ Company header detected - has logo, duration, no job title, short text');
                            return true;
                        }
                    }

                    // If it's very long text (>800 chars), it's likely a job description
                    if (textLength > 800) {
                        console.log('❌ Very long text - likely job description, not company header');
                        return false;
                    }
                }

                // Alternative check: Look for company name pattern without job structure
                const textContent = experienceItem.textContent || '';
                const hasCompanyPattern = textContent.includes('yrs') && textContent.includes('mos') &&
                    textContent.length < 200; // Company headers are usually short

                if (hasCompanyPattern && !experienceItem.querySelector('.mr1.hoverable-link-text.t-bold')) {
                    console.log('✅ Company header detected - duration pattern without job title');
                    return true;
                }

                console.log('❌ Not a company header');
                return false;

            } catch (error) {
                console.error('Error checking if company header:', error);
                return false;
            }
        }

        // Helper method to clean duplicated text (e.g., "VeeraVeera" -> "Veera")
        cleanDuplicatedText(text) {
            if (!text || text.length < 4) return text;

            // Check if the text is duplicated (first half equals second half)
            const halfLength = Math.floor(text.length / 2);
            const firstHalf = text.substring(0, halfLength);
            const secondHalf = text.substring(halfLength);

            if (firstHalf === secondHalf && firstHalf.length > 2) {
                console.log(`🧹 Cleaning duplicated text: "${text}" -> "${firstHalf}"`);
                return firstHalf;
            }

            // Check for common duplication patterns with spaces or separators
            const words = text.split(/[\s·]+/);
            if (words.length === 2 && words[0] === words[1] && words[0].length > 2) {
                console.log(`🧹 Cleaning duplicated words: "${text}" -> "${words[0]}"`);
                return words[0];
            }

            return text;
        }

        // Extract company information from a company header
        extractCompanyFromHeader(headerItem) {
            try {
                console.log('🏢 Extracting company from header...');
                console.log('🏢 Header HTML preview:', headerItem.innerHTML.substring(0, 300) + '...');

                let companyName = null;
                let companyLogo = null;

                // Extract company name - look for the main text that's not duration or dates
                const textContent = headerItem.textContent || '';
                console.log('🏢 Header text content:', textContent);

                const lines = textContent.split('\n').map(line => line.trim()).filter(line => line.length > 0);
                console.log('🏢 Text lines:', lines);

                for (let i = 0; i < lines.length; i++) {
                    const line = lines[i];
                    console.log(`🏢 Checking line ${i + 1}: "${line}"`);

                    // Skip duration lines (contain yrs, mos, or years)
                    if (line.includes('yrs') || line.includes('mos') || line.includes('years') ||
                        line.includes('·') || line.length <= 2) {
                        console.log(`  ⏭️ Skipping duration/separator line: "${line}"`);
                        continue;
                    }

                    // Skip date patterns (like "Jan 2024 - Present")
                    if (line.match(/\b(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\b/) ||
                        line.match(/\d{4}/) || line.includes('Present') || line.includes('-')) {
                        console.log(`  ⏭️ Skipping date line: "${line}"`);
                        continue;
                    }

                    // Skip location patterns
                    if (line.includes('India') || line.includes('Remote') || line.includes('On-site') ||
                        line.includes('Hybrid') || line.includes('Bengaluru') || line.includes('Karnataka')) {
                        console.log(`  ⏭️ Skipping location line: "${line}"`);
                        continue;
                    }

                    // This should be the company name
                    companyName = this.cleanDuplicatedText(line);
                    console.log(`✅ Company name from header: "${companyName}"`);
                    break;
                }

                // Extract company logo
                const logoImg = headerItem.querySelector('img');
                if (logoImg && logoImg.src && !logoImg.src.includes('data:image') && !logoImg.src.includes('ghost')) {
                    companyLogo = logoImg.src;
                    console.log(`✅ Company logo from header: "${companyLogo}"`);
                } else {
                    console.log('❌ No company logo found in header');
                }

                const result = {
                    name: companyName,
                    logo: companyLogo
                };

                console.log('🏢 Final company header result:', result);
                return result;

            } catch (error) {
                console.error('Error extracting company from header:', error);
                return null;
            }
        }

        // Check if an experience item is a job description rather than a job position
        isJobDescription(experienceItem) {
            try {
                const className = experienceItem.className || '';
                const textContent = experienceItem.textContent || '';
                const textLength = textContent.trim().length;

                console.log(`🔍 Checking if job description - class: "${className.substring(0, 100)}..."`);
                console.log(`🔍 Text length: ${textLength} characters`);

                // Check if it's a pvs-entity__sub-components that contains a job description
                if (className.includes('pvs-entity__sub-components')) {
                    // Look for job structure indicators
                    const hasJobTitle = experienceItem.querySelector('.mr1.hoverable-link-text.t-bold') ||
                        experienceItem.querySelector('.t-16.t-black.t-bold') ||
                        experienceItem.querySelector('.pvs-entity__caption-wrapper .mr1.t-bold');

                    const hasCompanyLogo = experienceItem.querySelector('img') ||
                        experienceItem.querySelector('.entity-image');

                    console.log(`Has job title structure: ${!!hasJobTitle}`);
                    console.log(`Has company logo: ${!!hasCompanyLogo}`);

                    // If it has job title structure, it's a position, not a description
                    if (hasJobTitle) {
                        console.log('❌ Has job title structure - this is a job position');
                        return false;
                    }

                    // If it has company logo and short text with duration, it's a company header
                    if (hasCompanyLogo && textLength < 300 &&
                        (textContent.includes('yrs') || textContent.includes('mos'))) {
                        console.log('❌ Has company logo and duration - this is a company header');
                        return false;
                    }

                    // If it's very long text without job structure or logo, it's likely a description
                    if (textLength > 500 && !hasJobTitle && !hasCompanyLogo) {
                        console.log('✅ Long text without job structure or logo - likely job description');
                        return true;
                    }

                    // If it's medium length text without clear structure, check content
                    if (textLength > 200 && !hasJobTitle && !hasCompanyLogo) {
                        // Look for description-like content
                        const hasDescriptionWords = textContent.toLowerCase().includes('responsible') ||
                            textContent.toLowerCase().includes('managed') ||
                            textContent.toLowerCase().includes('developed') ||
                            textContent.toLowerCase().includes('led') ||
                            textContent.toLowerCase().includes('achieved') ||
                            textContent.toLowerCase().includes('worked') ||
                            textContent.toLowerCase().includes('experience');

                        if (hasDescriptionWords) {
                            console.log('✅ Contains description-like words - likely job description');
                            return true;
                        }
                    }
                }

                // Secondary check: Look for specific job description indicators
                if (className.includes('pvs-list__item--with-top-padding') &&
                    !className.includes('artdeco-list__item')) {
                    console.log('✅ Found job description padding class without job structure');
                    return true;
                }

                // Tertiary check: Very long text content (descriptions are usually much longer)
                if (textLength > 1000) {
                    const hasJobStructure = experienceItem.querySelector('.mr1.hoverable-link-text.t-bold') ||
                        experienceItem.querySelector('.t-16.t-black.t-bold') ||
                        experienceItem.querySelector('.pvs-entity__caption-wrapper .mr1.t-bold');

                    if (!hasJobStructure) {
                        console.log('✅ Very long text with no job structure - likely description');
                        return true;
                    }
                }

                // Check if it's nested under a job position (job descriptions are often sub-items)
                const parentLi = experienceItem.closest('li.artdeco-list__item');
                if (parentLi && parentLi !== experienceItem) {
                    console.log('✅ Nested under another li - likely job description');
                    return true;
                }

                console.log('❌ This appears to be a job position');
                return false;

            } catch (error) {
                console.error('Error checking if job description:', error);
                return false; // If error, assume it's a job position to be safe
            }
        }

        // Extract data from a single experience item
        extractSingleExperience(experienceItem, index, companyGroup = null) {
            try {
                console.log(`🔍 Extracting single experience ${index + 1}...`);
                console.log(`Experience ${index + 1} HTML:`, experienceItem.innerHTML.substring(0, 400) + '...');

                let jobTitle = null;
                let company = null;
                let companyLogo = null;
                let duration = null;
                let location = null;

                // If we have a company group (multiple positions at same company), use it
                if (companyGroup) {
                    company = companyGroup.name;
                    companyLogo = companyGroup.logo;
                    console.log(`🏢 Using company from group: "${company}"`);
                    if (companyLogo) {
                        console.log(`🏢 Using company logo from group: "${companyLogo}"`);
                    }
                }

                // Method A: Try to find job title and company in specific elements first
                console.log(`🎯 Method A: Looking for structured elements in experience ${index + 1}...`);
                console.log(`Experience item HTML preview:`, experienceItem.innerHTML.substring(0, 500) + '...');

                // Look for job title in common LinkedIn selectors (try both with and without nested spans)
                const jobTitleSelectors = [
                    '.mr1.hoverable-link-text.t-bold',
                    '.mr1.hoverable-link-text.t-bold span[aria-hidden="true"]',
                    '.t-16.t-black.t-bold',
                    '.t-16.t-black.t-bold span[aria-hidden="true"]',
                    '.pvs-entity__caption-wrapper .mr1.t-bold',
                    '.pvs-entity__caption-wrapper .mr1.t-bold span[aria-hidden="true"]',
                    'div[data-field="title"] span[aria-hidden="true"]',
                    '.artdeco-entity-lockup__title span[aria-hidden="true"]'
                ];

                console.log(`🔍 Searching for job title with ${jobTitleSelectors.length} selectors...`);
                for (const selector of jobTitleSelectors) {
                    const element = experienceItem.querySelector(selector);
                    console.log(`  Selector "${selector}": ${element ? 'found' : 'not found'}`);
                    if (element && element.textContent?.trim()) {
                        let text = element.textContent.trim();
                        console.log(`    Raw text content: "${text}"`);

                        // Clean up duplicated text (e.g., "VeeraVeera" -> "Veera")
                        text = this.cleanDuplicatedText(text);
                        console.log(`    Cleaned text content: "${text}"`);

                        // Skip if it looks like duration, company info, or location
                        if (!text.includes('yrs') && !text.includes('mos') && !text.includes('·') &&
                            !text.match(/\d{4}/) && !text.includes('India') && !text.includes('Remote') &&
                            !text.includes('On-site') && !text.includes('Hybrid') && text.length > 3) {
                            jobTitle = text;
                            console.log(`✅ Job title found with selector "${selector}": "${jobTitle}"`);
                            break;
                        } else {
                            console.log(`    ⏭️ Skipping - looks like duration/company/location: "${text}"`);
                        }
                    }
                }

                // Look for company in common LinkedIn selectors (only if not from group)
                if (!company) {
                    console.log(`🔍 Searching for company (not from group)...`);
                    const companySelectors = [
                        '.t-14.t-normal',
                        '.t-14.t-normal span[aria-hidden="true"]',
                        '.t-14.t-black--light',
                        '.t-14.t-black--light span[aria-hidden="true"]',
                        '.pvs-entity__caption-wrapper .t-14',
                        '.pvs-entity__caption-wrapper .t-14 span[aria-hidden="true"]',
                        'div[data-field="company"] span[aria-hidden="true"]',
                        '.artdeco-entity-lockup__subtitle span[aria-hidden="true"]'
                    ];

                    for (const selector of companySelectors) {
                        const element = experienceItem.querySelector(selector);
                        console.log(`  Company selector "${selector}": ${element ? 'found' : 'not found'}`);
                        if (element && element.textContent?.trim() && element.textContent.trim() !== jobTitle) {
                            let text = element.textContent.trim();
                            console.log(`    Raw company text content: "${text}"`);

                            // Clean up duplicated text
                            text = this.cleanDuplicatedText(text);
                            console.log(`    Cleaned company text content: "${text}"`);

                            // Skip if it looks like duration, dates, or location
                            if (!text.includes('yrs') && !text.includes('mos') && !text.match(/\d{4}/) &&
                                !text.includes('Present') && !text.includes('India') && !text.includes('Remote') &&
                                !text.includes('On-site') && !text.includes('Hybrid') && !text.includes('Bengaluru') &&
                                text.length > 2) {
                                company = text.split('·')[0].trim(); // Remove "· Full-time" etc.
                                console.log(`✅ Company found with selector "${selector}": "${company}"`);
                                break;
                            } else {
                                console.log(`    ⏭️ Skipping - looks like duration/date/location: "${text}"`);
                            }
                        }
                    }
                }

                // Look for company logo (only if not from group)
                if (!companyLogo) {
                    const logoSelectors = [
                        'img[alt*="logo"]',
                        'img[src*="company"]',
                        '.entity-image img',
                        '.artdeco-entity-lockup__image img',
                        '.pvs-entity__image img'
                    ];

                    for (const selector of logoSelectors) {
                        const logoImg = experienceItem.querySelector(selector);
                        if (logoImg && logoImg.src && !logoImg.src.includes('data:image') && !logoImg.src.includes('ghost')) {
                            companyLogo = logoImg.src;
                            console.log(`✅ Company logo found with selector "${selector}": "${companyLogo}"`);
                            break;
                        }
                    }
                }

                // Method B: Fallback to scanning all spans if structured approach didn't work
                if (!jobTitle || (!company && !companyGroup)) {
                    console.log(`🎯 Method B: Scanning all spans in experience ${index + 1}...`);
                    console.log(`Current state - jobTitle: "${jobTitle}", company: "${company}", companyGroup: ${!!companyGroup}`);

                    // Get all spans with aria-hidden="true"
                    const allSpans = experienceItem.querySelectorAll('span[aria-hidden="true"]');
                    console.log(`Found ${allSpans.length} spans in experience ${index + 1}`);

                    // Extract job title and company from spans
                    for (let i = 0; i < allSpans.length; i++) {
                        const span = allSpans[i];
                        const text = span.textContent?.trim();
                        console.log(`  Span ${i + 1}: "${text}"`);

                        if (text && text.length > 2) {
                            // Skip obvious non-job-title content first
                            if (text.includes('yrs') || text.includes('mos') || text.includes('·') ||
                                text.match(/\d{4}/) || text.includes('Present') || text.includes('Full-time') ||
                                text.includes('Part-time') || text.includes('Remote') || text.includes('On-site') ||
                                text.includes('Hybrid') || text.includes('India') || text.includes('Bengaluru')) {
                                console.log(`    ⏭️ Skipping non-job content: "${text}"`);
                                continue;
                            }

                            // Look for job title patterns (only if we don't have one yet)
                            if (!jobTitle) {
                                // Check if this looks like a job title
                                const isJobTitle = text.toLowerCase().includes('ceo') ||
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
                                    text.toLowerCase().includes('expert') ||
                                    text.toLowerCase().includes('officer') ||
                                    text.toLowerCase().includes('advisor') ||
                                    text.toLowerCase().includes('chief') ||
                                    text.toLowerCase().includes('vice') ||
                                    text.toLowerCase().includes('senior') ||
                                    text.toLowerCase().includes('junior') ||
                                    text.toLowerCase().includes('associate') ||
                                    text.toLowerCase().includes('assistant');

                                if (isJobTitle) {
                                    jobTitle = this.cleanDuplicatedText(text);
                                    console.log(`  ✅ Job title found (fallback): "${jobTitle}"`);
                                } else {
                                    console.log(`    ❓ Not a job title pattern: "${text}"`);
                                }
                            }
                            // Look for company name (only if we don't have one from group and it's not the job title)
                            else if (!company && !companyGroup && text !== jobTitle) {
                                // This could be a company name if it's not already identified as something else
                                const cleanedText = this.cleanDuplicatedText(text);
                                console.log(`    🏢 Potential company name: "${cleanedText}"`);
                                company = cleanedText;
                                console.log(`  ✅ Company found (fallback): "${company}"`);
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

                // Final result summary
                console.log(`📋 Experience ${index + 1} extraction summary:`);
                console.log(`   Job Title: ${jobTitle || 'Not found'}`);
                console.log(`   Company: ${company || 'Not found'}`);
                console.log(`   Company Logo: ${companyLogo || 'Not found'}`);
                console.log(`   Duration: ${duration || 'Not found'}`);
                console.log(`   Location: ${location || 'Not found'}`);

                if (jobTitle || company) {
                    return {
                        jobTitle,
                        company,
                        companyLogo,
                        duration,
                        location
                    };
                }

                console.log(`❌ Experience ${index + 1}: No job title or company found`);
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
                if (this.logger) {
                    this.logger.warn('Extension context invalidated, cannot send data to sidebar');
                }
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
                        if (this.logger) {
                            const errorMsg = chrome.runtime.lastError.message;
                            if (errorMsg.includes('Extension context invalidated')) {
                                this.logger.warn('Extension context invalidated - this is normal when reloading extension');
                            } else if (errorMsg.includes('Could not establish connection')) {
                                this.logger.warn('Could not establish connection - sidebar may not be open');
                            } else {
                                this.logger.error('Runtime error sending data to sidebar:', chrome.runtime.lastError);
                            }
                        }
                        return;
                    }

                    if (response && response.success && this.logger) {
                        this.logger.log('Page data sent to sidebar successfully');
                    }
                });
            } catch (error) {
                if (this.logger) {
                    this.logger.error('Error sending page data to sidebar:', error);
                }
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

                    case 'GET_PAGE_DATA':
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
