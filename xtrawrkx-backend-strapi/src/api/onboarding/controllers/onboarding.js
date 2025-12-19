'use strict';

const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// JWT secret - use environment variable or fallback to default
const JWT_SECRET = process.env.JWT_SECRET || 'myJwtSecret123456789012345678901234567890';

/**
 * Onboarding Controller
 * Handles client portal onboarding and account creation
 */
module.exports = {
    /**
     * Complete onboarding and create client account
     */
    async completeOnboarding(ctx) {
        try {
            const {
                // Company information
                companyName,
                industry,
                website,
                phone,
                email,
                address,
                city,
                state,
                zipCode,
                country,
                employees,
                description,
                founded,
                location,
                interests,

                // Primary contact information
                contactFirstName,
                contactLastName,
                contactEmail,
                contactPhone,
                contactTitle,
                contactDepartment,
                contactLocation,

                // Authentication
                password,

                // Additional data
                onboardingData = {}
            } = ctx.request.body;

            // Validate required fields
            if (!companyName || !industry || !email || !contactFirstName || !contactLastName || !contactEmail || !password) {
                return ctx.badRequest('Missing required fields');
            }

            if (password.length < 8) {
                return ctx.badRequest('Password must be at least 8 characters long');
            }

            // Find existing account created during signup (by email)
            const existingAccount = await strapi.db.query('api::client-account.client-account').findOne({
                where: {
                    email: email.toLowerCase()
                },
            });

            if (!existingAccount) {
                return ctx.badRequest('Account not found. Please complete signup first.');
            }

            // Update password if provided (optional - user might not want to change it)
            let updateData = {
                companyName,
                industry,
                website,
                phone,
                address,
                city,
                state,
                zipCode,
                country,
                employees: employees ? String(employees).trim() : null,
                description,
                founded,
                location: (() => {
                    if (location !== undefined && location !== null) {
                        const locStr = String(location).trim();
                        if (locStr !== '') return locStr;
                    }
                    if (onboardingData.location !== undefined && onboardingData.location !== null) {
                        const locStr = String(onboardingData.location).trim();
                        if (locStr !== '') return locStr;
                    }
                    return null;
                })(),
                interests: (interests && Array.isArray(interests) && interests.length > 0) ? interests : (onboardingData.interests && Array.isArray(onboardingData.interests) && onboardingData.interests.length > 0) ? onboardingData.interests : null,
                selectedCommunities: (onboardingData.selectedCommunities && Array.isArray(onboardingData.selectedCommunities) && onboardingData.selectedCommunities.length > 0) ? onboardingData.selectedCommunities : [],
                lastActivity: new Date(),
                onboardingCompleted: true,
                onboardingCompletedAt: new Date(),
                onboardingData: {
                    ...onboardingData,
                    location: location || onboardingData.location,
                    interests: interests || onboardingData.interests,
                    selectedCommunities: onboardingData.selectedCommunities || [],
                },
            };

            // Add new fields from client account details
            if (companyType !== undefined && companyType !== null && companyType !== '') {
                updateData.companyType = companyType;
            }
            if (subType !== undefined && subType !== null && subType !== '') {
                updateData.subType = subType.trim();
            }
            if (type !== undefined && type !== null && type !== '') {
                updateData.type = type;
            }
            // Handle revenue - can be dropdown value (REVENUE_*) or numeric string
            if (revenue !== undefined && revenue !== null && revenue !== '') {
                const revenueStr = String(revenue).trim();
                if (revenueStr !== '') {
                    // If it's a dropdown value (starts with REVENUE_), store as string
                    if (revenueStr.startsWith('REVENUE_')) {
                        updateData.revenue = revenueStr;
                    } else {
                        // Try to parse as number if it's a numeric string
                        const revenueNum = parseFloat(revenueStr.replace(/[^0-9.]/g, ''));
                        updateData.revenue = isNaN(revenueNum) ? revenueStr : revenueNum;
                    }
                } else {
                    updateData.revenue = null;
                }
            }

            // Only update password if provided
            if (password) {
                const hashedPassword = await bcrypt.hash(password, 12);
                updateData.password = hashedPassword;
            }

            // Update the existing client account with onboarding data
            const account = await strapi.db.query('api::client-account.client-account').update({
                where: { id: existingAccount.id },
                data: updateData,
            });

            // Find existing contact created during signup (by email and clientAccount)
            let contact = await strapi.db.query('api::contact.contact').findOne({
                where: {
                    email: contactEmail.toLowerCase(),
                    clientAccount: account.id
                },
            });

            // If contact not found by email, try to find primary contact for this account
            if (!contact) {
                contact = await strapi.db.query('api::contact.contact').findOne({
                    where: {
                        clientAccount: account.id,
                        role: 'PRIMARY_CONTACT'
                    },
                });
            }

            // Update or create primary contact
            if (contact) {
                // Update existing contact with onboarding data
                contact = await strapi.db.query('api::contact.contact').update({
                    where: { id: contact.id },
                    data: {
                        firstName: contactFirstName,
                        lastName: contactLastName,
                        email: contactEmail.toLowerCase(),
                        phone: contactPhone,
                        title: contactTitle,
                        department: contactDepartment,
                        location: (() => {
                            if (contactLocation !== undefined && contactLocation !== null) {
                                const locStr = String(contactLocation).trim();
                                if (locStr !== '') return locStr;
                            }
                            if (location !== undefined && location !== null) {
                                const locStr = String(location).trim();
                                if (locStr !== '') return locStr;
                            }
                            return null;
                        })(),
                        address: address || null,
                        role: 'PRIMARY_CONTACT',
                        portalAccessLevel: 'FULL_ACCESS',
                        status: 'ACTIVE',
                        lastContactDate: new Date(),
                    },
                });
            } else {
                // Create new contact if somehow it doesn't exist
                contact = await strapi.db.query('api::contact.contact').create({
                    data: {
                        clientAccount: account.id,
                        firstName: contactFirstName,
                        lastName: contactLastName,
                        email: contactEmail.toLowerCase(),
                        phone: contactPhone,
                        title: contactTitle,
                        department: contactDepartment,
                        location: (() => {
                            if (contactLocation !== undefined && contactLocation !== null) {
                                const locStr = String(contactLocation).trim();
                                if (locStr !== '') return locStr;
                            }
                            if (location !== undefined && location !== null) {
                                const locStr = String(location).trim();
                                if (locStr !== '') return locStr;
                            }
                            return null;
                        })(),
                        address: address || null,
                        role: 'PRIMARY_CONTACT',
                        portalAccessLevel: 'FULL_ACCESS',
                        status: 'ACTIVE',
                        source: 'ONBOARDING',
                        lastContactDate: new Date(),
                    },
                });
            }

            // Process community submissions if any
            if (onboardingData.submissions && Object.keys(onboardingData.submissions).length > 0) {
                for (const [community, submissionData] of Object.entries(onboardingData.submissions)) {
                    const submissionId = `${account.id}-${community}-${Date.now()}`;

                    await strapi.db.query('api::community-submission.community-submission').create({
                        data: {
                            clientAccount: account.id,
                            community: community,
                            submissionData: submissionData,
                            submissionId: submissionId,
                            status: 'SUBMITTED',
                        },
                    });
                }
            }

            // Create community memberships for selected communities
            if (onboardingData.selectedCommunities && onboardingData.selectedCommunities.length > 0) {
                for (const community of onboardingData.selectedCommunities) {
                    // Determine membership type based on community
                    const membershipType = (community === 'XEVFIN') ? 'PREMIUM' : 'FREE';

                    await strapi.db.query('api::community-membership.community-membership').create({
                        data: {
                            clientAccount: account.id,
                            community: community,
                            membershipType: membershipType,
                            status: 'ACTIVE',
                            joinedAt: new Date(),
                            membershipData: {
                                joinedViaOnboarding: true,
                                initialInterests: onboardingData.interests || [],
                            },
                        },
                    });
                }
            }

            // Generate JWT token for immediate login
            const token = jwt.sign({
                id: account.id,
                email: account.email,
                type: 'client',
                companyName: account.companyName
            }, JWT_SECRET, { expiresIn: '7d' });

            // Get all contacts for the account
            const contacts = await strapi.db.query('api::contact.contact').findMany({
                where: {
                    clientAccount: account.id,
                    status: 'ACTIVE'
                },
                select: ['id', 'firstName', 'lastName', 'email', 'role', 'portalAccessLevel']
            });

            // Send welcome email
            try {
                await strapi.plugins['email'].services.email.send({
                    to: email,
                    subject: 'Welcome to XtraWrkx Client Portal',
                    html: `
                        <h2>Welcome to XtraWrkx!</h2>
                        <p>Hello ${contactFirstName},</p>
                        <p>Your client portal account has been successfully created for ${companyName}.</p>
                        <p>You can now access your portal to:</p>
                        <ul>
                            <li>View project progress</li>
                            <li>Access documents and files</li>
                            <li>Communicate with your project team</li>
                            <li>Manage invoices and billing</li>
                        </ul>
                        <p><a href="${process.env.CLIENT_PORTAL_URL}">Access Your Portal</a></p>
                        <p>Thank you for choosing XtraWrkx!</p>
                    `
                });
            } catch (emailError) {
                console.error('Failed to send welcome email:', emailError);
                // Don't fail the onboarding if email fails
            }

            // Get account with populated community data
            const accountWithCommunities = await strapi.db.query('api::client-account.client-account').findOne({
                where: { id: account.id },
                populate: ['communityMemberships', 'communitySubmissions']
            });

            ctx.send({
                success: true,
                account: {
                    id: account.id,
                    email: account.email,
                    companyName: account.companyName,
                    industry: account.industry,
                    location: account.location,
                    interests: account.interests,
                    selectedCommunities: account.selectedCommunities,
                    type: account.type,
                    isActive: account.isActive,
                    emailVerified: account.emailVerified,
                    onboardingCompleted: account.onboardingCompleted,
                    communityMemberships: accountWithCommunities?.communityMemberships || [],
                    communitySubmissions: accountWithCommunities?.communitySubmissions || []
                },
                primaryContact: {
                    id: contact.id,
                    firstName: contact.firstName,
                    lastName: contact.lastName,
                    email: contact.email,
                    role: contact.role,
                    portalAccessLevel: contact.portalAccessLevel,
                    location: contact.location
                },
                contacts: contacts,
                token: token,
                message: 'Onboarding completed successfully'
            });
        } catch (error) {
            console.error('Onboarding completion error:', error);
            ctx.internalServerError('Failed to complete onboarding');
        }
    },

    /**
     * Add additional contact to existing account
     */
    async addContact(ctx) {
        try {
            const {
                firstName,
                lastName,
                email,
                phone,
                title,
                department,
                role = 'USER',
                portalAccessLevel = 'READ_ONLY'
            } = ctx.request.body;

            // Get current user (must be logged in client account)
            const currentUser = ctx.state.user;
            if (!currentUser || currentUser.type !== 'client') {
                return ctx.forbidden('Only client accounts can add contacts');
            }

            // Check if primary contact is making the request
            const primaryContact = await strapi.db.query('api::contact.contact').findOne({
                where: {
                    account: currentUser.id,
                    role: 'PRIMARY_CONTACT'
                },
            });

            if (!primaryContact) {
                return ctx.forbidden('Only primary contact can add new contacts');
            }

            // Validate required fields
            if (!firstName || !lastName || !email) {
                return ctx.badRequest('First name, last name, and email are required');
            }

            // Check if contact already exists
            const existingContact = await strapi.db.query('api::contact.contact').findOne({
                where: { email: email.toLowerCase() },
            });

            if (existingContact) {
                return ctx.badRequest('Contact with this email already exists');
            }

            // Create contact
            const contact = await strapi.db.query('api::contact.contact').create({
                data: {
                    account: currentUser.id,
                    firstName,
                    lastName,
                    email: email.toLowerCase(),
                    phone,
                    title,
                    department,
                    role,
                    portalAccessLevel,
                    status: 'ACTIVE',
                    source: 'EXTENSION',
                    lastContactDate: new Date(),
                },
            });

            // Send invitation email to new contact
            try {
                await strapi.plugins['email'].services.email.send({
                    to: email,
                    subject: 'You\'ve been added to XtraWrkx Client Portal',
                    html: `
                        <h2>Welcome to ${currentUser.companyName}'s Client Portal</h2>
                        <p>Hello ${firstName},</p>
                        <p>You have been added to the XtraWrkx client portal for ${currentUser.companyName}.</p>
                        <p>You can access the portal using your company's login credentials.</p>
                        <p><a href="${process.env.CLIENT_PORTAL_URL}">Access Portal</a></p>
                        <p>Your access level: ${portalAccessLevel.replace('_', ' ').toLowerCase()}</p>
                    `
                });
            } catch (emailError) {
                console.error('Failed to send invitation email:', emailError);
                // Don't fail the contact creation if email fails
            }

            ctx.send({
                contact: {
                    id: contact.id,
                    firstName: contact.firstName,
                    lastName: contact.lastName,
                    email: contact.email,
                    role: contact.role,
                    portalAccessLevel: contact.portalAccessLevel,
                    status: contact.status,
                },
                message: 'Contact added successfully'
            });
        } catch (error) {
            console.error('Add contact error:', error);
            ctx.internalServerError('Failed to add contact');
        }
    },

    /**
     * Get account contacts (for managing portal access)
     */
    async getAccountContacts(ctx) {
        try {
            // Get current user (must be logged in client account)
            const currentUser = ctx.state.user;
            if (!currentUser || currentUser.type !== 'client') {
                return ctx.forbidden('Only client accounts can view contacts');
            }

            // Get all contacts for the account
            const contacts = await strapi.db.query('api::contact.contact').findMany({
                where: {
                    clientAccount: currentUser.id,
                    status: 'ACTIVE'
                },
                select: ['id', 'firstName', 'lastName', 'email', 'phone', 'title', 'department', 'role', 'portalAccessLevel', 'lastContactDate'],
                orderBy: { role: 'asc' }, // Primary contact first
            });

            ctx.send({
                contacts,
                totalCount: contacts.length
            });
        } catch (error) {
            console.error('Get account contacts error:', error);
            ctx.internalServerError('Failed to get contacts');
        }
    },

    /**
     * Client login authentication
     */
    async clientLogin(ctx) {
        try {
            const { email, password } = ctx.request.body;

            if (!email || !password) {
                return ctx.badRequest('Email and password are required');
            }

            // Find client account
            const account = await strapi.db.query('api::client-account.client-account').findOne({
                where: {
                    email: email.toLowerCase(),
                    isActive: true
                },
            });

            if (!account) {
                return ctx.badRequest('Invalid credentials');
            }

            // Verify password
            const isValidPassword = await bcrypt.compare(password, account.password);
            if (!isValidPassword) {
                return ctx.badRequest('Invalid credentials');
            }

            // Generate JWT token
            const jwt = strapi.plugins['users-permissions'].services.jwt.issue({
                id: account.id,
                email: account.email,
                type: 'client',
                companyName: account.companyName
            });

            // Update last login
            await strapi.db.query('api::client-account.client-account').update({
                where: { id: account.id },
                data: { lastActivityDate: new Date() }
            });

            ctx.send({
                user: {
                    id: account.id,
                    email: account.email,
                    companyName: account.companyName,
                    needsOnboarding: !account.onboardingCompleted,
                    onboarded: account.onboardingCompleted,
                },
                account: {
                    id: account.id,
                    email: account.email,
                    companyName: account.companyName,
                    onboardingCompleted: account.onboardingCompleted,
                    onboardingCompletedAt: account.onboardingCompletedAt,
                    phone: account.phone,
                    industry: account.industry,
                    location: account.location,
                    interests: account.interests,
                    selectedCommunities: account.selectedCommunities,
                    type: account.type,
                    companyType: account.companyType,
                    subType: account.subType,
                    employees: account.employees,
                    revenue: account.revenue,
                    founded: account.founded,
                },
                token: jwt,
                message: 'Login successful'
            });
        } catch (error) {
            console.error('Client login error:', error);
            ctx.internalServerError('Login failed');
        }
    },

    /**
     * Update user basics during onboarding
     */
    async updateBasics(ctx) {
        // Extract variables at the top level so they're available in catch block
        let accountId, basics, email;

        // Log incoming request
        console.log('updateBasics called with:', {
            hasBody: !!ctx.request.body,
            bodyKeys: ctx.request.body ? Object.keys(ctx.request.body) : [],
            accountId: ctx.request.body?.accountId,
            email: ctx.request.body?.email,
            hasBasics: !!ctx.request.body?.basics,
            basicsKeys: ctx.request.body?.basics ? Object.keys(ctx.request.body.basics) : []
        });

        try {
            ({ accountId, basics, email } = ctx.request.body || {});

            // Validate basics data exists
            if (!basics || typeof basics !== 'object') {
                return ctx.badRequest('Basics data is required');
            }

            // Find account by ID or email
            let account;
            if (accountId) {
                // Handle both numeric ID and documentId
                const accountIdToUse = accountId?.id || accountId?.documentId || accountId;
                // Try by id first
                account = await strapi.db.query('api::client-account.client-account').findOne({
                    where: { id: accountIdToUse }
                });
                // If not found, try by documentId
                if (!account) {
                    account = await strapi.db.query('api::client-account.client-account').findOne({
                        where: { documentId: accountIdToUse }
                    });
                }
            } else if (email) {
                account = await strapi.db.query('api::client-account.client-account').findOne({
                    where: { email: email.toLowerCase() }
                });
            } else {
                return ctx.badRequest('Account ID or email is required');
            }

            if (!account) {
                console.error('Account not found:', { accountId, email });
                return ctx.notFound('Account not found');
            }

            // Extract company and contact data from basics (with safe defaults)
            const {
                companyName,
                industry,
                website,
                phone,
                address,
                city,
                state,
                zipCode,
                country,
                employees,
                description,
                founded,
                // Contact data - can come as name (split) or separate firstName/lastName
                name,
                contactFirstName,
                contactLastName,
                contactEmail,
                contactPhone,
                role, // This is the user's role (Founder, Student, etc.)
                title,
                contactTitle,
                contactDepartment,
                // Onboarding form specific fields
                location,
                interests,
                selectedCommunities,
                // Optional company fields from schema
                companyEmail,
                companyPhone,
                companyAddress,
                companyWebsite,
                companySize,
                // New fields from client account details
                companyType,
                subType,
                type,
                revenue,
            } = basics || {};

            // Parse name if provided as single field
            let firstName = contactFirstName || '';
            let lastName = contactLastName || '';
            if (name && !contactFirstName) {
                const nameStr = String(name || '').trim();
                if (nameStr) {
                    const nameParts = nameStr.split(' ');
                    firstName = nameParts[0] || '';
                    lastName = nameParts.slice(1).join(' ') || firstName; // Use firstName as fallback if no lastName
                }
            }

            // Update account with company basics
            // Ensure onboardingData is properly serialized (no Date objects, functions, etc.)
            const onboardingDataToStore = {};
            for (const [key, value] of Object.entries(basics)) {
                // Skip functions and undefined values
                if (typeof value === 'function' || value === undefined) {
                    continue;
                }
                // Convert Date objects to ISO strings
                if (value instanceof Date) {
                    onboardingDataToStore[key] = value.toISOString();
                }
                // Keep arrays and objects as-is (but they should be serializable)
                else if (Array.isArray(value) || (typeof value === 'object' && value !== null)) {
                    onboardingDataToStore[key] = value;
                }
                // Keep primitives
                else {
                    onboardingDataToStore[key] = value;
                }
            }
            onboardingDataToStore.updatedAt = new Date().toISOString();

            const updateData = {
                onboardingData: onboardingDataToStore
            };

            // Update company fields if provided
            if (companyName !== undefined && companyName !== null && companyName !== '') {
                updateData.companyName = String(companyName).trim();
            }
            if (industry !== undefined && industry !== null && industry !== '') {
                updateData.industry = String(industry).trim();
            }
            if (website !== undefined) updateData.website = website || companyWebsite || null;
            if (phone !== undefined) updateData.phone = phone || companyPhone || null;
            if (address !== undefined) updateData.address = address || companyAddress || null;
            if (city !== undefined && city !== null && city !== '') updateData.city = String(city).trim();
            if (state !== undefined && state !== null && state !== '') updateData.state = String(state).trim();
            if (zipCode !== undefined && zipCode !== null && zipCode !== '') updateData.zipCode = String(zipCode).trim();
            if (country !== undefined && country !== null && country !== '') updateData.country = String(country).trim();
            // Handle employees - can be dropdown value (SIZE_*) or free text
            if (employees !== undefined) {
                const employeesValue = employees || companySize || null;
                if (employeesValue !== null && employeesValue !== '') {
                    // If it's a dropdown value (starts with SIZE_), store as-is
                    // Otherwise, store as string
                    updateData.employees = String(employeesValue).trim() || null;
                } else {
                    updateData.employees = null;
                }
            }
            if (description !== undefined) updateData.description = description;
            if (founded !== undefined && founded !== null && founded !== '') updateData.founded = founded.trim();
            // New fields from client account details
            if (companyType !== undefined && companyType !== null && companyType !== '') {
                updateData.companyType = companyType;
            }
            if (subType !== undefined && subType !== null && subType !== '') {
                updateData.subType = subType.trim();
            }
            if (type !== undefined && type !== null && type !== '') {
                updateData.type = type;
            }
            // Handle revenue - can be dropdown value (REVENUE_*) or numeric string
            if (revenue !== undefined && revenue !== null && revenue !== '') {
                const revenueStr = String(revenue).trim();
                if (revenueStr !== '') {
                    // If it's a dropdown value (starts with REVENUE_), store as string
                    if (revenueStr.startsWith('REVENUE_')) {
                        updateData.revenue = revenueStr;
                    } else {
                        // Try to parse as number if it's a numeric string
                        const revenueNum = parseFloat(revenueStr.replace(/[^0-9.]/g, ''));
                        updateData.revenue = isNaN(revenueNum) ? revenueStr : revenueNum;
                    }
                } else {
                    updateData.revenue = null;
                }
            }
            if (location !== undefined && location !== null) {
                const locationStr = String(location).trim();
                updateData.location = locationStr !== '' ? locationStr : null;
            }
            if (interests !== undefined) {
                updateData.interests = (Array.isArray(interests) && interests.length > 0) ? interests : null;
            }
            // Handle selected communities - save to account
            if (selectedCommunities !== undefined && selectedCommunities !== null) {
                if (Array.isArray(selectedCommunities) && selectedCommunities.length > 0) {
                    updateData.selectedCommunities = selectedCommunities;
                    // Also update onboardingData with communities
                    updateData.onboardingData = {
                        ...updateData.onboardingData,
                        selectedCommunities: selectedCommunities,
                        updatedAt: new Date().toISOString()
                    };
                } else {
                    updateData.selectedCommunities = null;
                }
            }
            // Handle company email - use companyEmail if provided, otherwise keep existing
            if (companyEmail) updateData.email = companyEmail.toLowerCase();

            // Sanitize updateData - remove any undefined values and ensure proper types
            const sanitizedUpdateData = {};
            for (const [key, value] of Object.entries(updateData)) {
                if (value !== undefined) {
                    // Handle nested objects (like onboardingData)
                    if (key === 'onboardingData' && typeof value === 'object') {
                        const sanitizedNested = {};
                        for (const [nestedKey, nestedValue] of Object.entries(value)) {
                            if (nestedValue !== undefined) {
                                // Convert Date objects to ISO strings
                                if (nestedValue instanceof Date) {
                                    sanitizedNested[nestedKey] = nestedValue.toISOString();
                                } else {
                                    sanitizedNested[nestedKey] = nestedValue;
                                }
                            }
                        }
                        sanitizedUpdateData[key] = sanitizedNested;
                    } else {
                        sanitizedUpdateData[key] = value;
                    }
                }
            }

            // Log update data for debugging (in development)
            if (process.env.NODE_ENV === 'development') {
                try {
                    console.log('Updating account with data:', JSON.stringify(sanitizedUpdateData, null, 2));
                } catch (jsonError) {
                    console.error('Failed to stringify updateData:', jsonError);
                    console.log('Update data keys:', Object.keys(sanitizedUpdateData));
                }
            }

            let updatedAccount;
            try {
                updatedAccount = await strapi.db.query('api::client-account.client-account').update({
                    where: { id: account.id },
                    data: sanitizedUpdateData
                });
            } catch (dbError) {
                console.error('Database update error:', dbError);
                try {
                    console.error('Update data that failed:', JSON.stringify(sanitizedUpdateData, null, 2));
                } catch (jsonError) {
                    console.error('Failed to stringify failed data:', jsonError);
                    console.error('Update data keys:', Object.keys(sanitizedUpdateData));
                }
                console.error('Error details:', {
                    message: dbError.message,
                    name: dbError.name,
                    stack: dbError.stack
                });
                throw new Error(`Database update failed: ${dbError.message}`);
            }

            // Create or update community memberships if communities are selected
            if (selectedCommunities && Array.isArray(selectedCommunities) && selectedCommunities.length > 0) {
                // Get existing memberships
                const existingMemberships = await strapi.db.query('api::community-membership.community-membership').findMany({
                    where: {
                        clientAccount: account.id
                    }
                });

                const existingCommunityCodes = existingMemberships.map(m => m.community);

                // Create memberships for newly selected communities
                for (const community of selectedCommunities) {
                    if (!existingCommunityCodes.includes(community)) {
                        // Determine membership type based on community
                        const membershipType = (community === 'XEVFIN') ? 'PREMIUM' : 'FREE';

                        await strapi.db.query('api::community-membership.community-membership').create({
                            data: {
                                clientAccount: account.id,
                                community: community,
                                membershipType: membershipType,
                                status: 'ACTIVE',
                                joinedAt: new Date(),
                                membershipData: {
                                    joinedViaOnboarding: true,
                                    initialInterests: interests || [],
                                },
                            },
                        });
                    }
                }

                // Deactivate memberships for communities that are no longer selected
                for (const membership of existingMemberships) {
                    if (!selectedCommunities.includes(membership.community)) {
                        await strapi.db.query('api::community-membership.community-membership').update({
                            where: { id: membership.id },
                            data: {
                                status: 'INACTIVE'
                            }
                        });
                    }
                }
            }

            // Update primary contact if contact data is provided
            let updatedContact = null;
            const hasLocation = location !== undefined && location !== null && String(location).trim() !== '';
            if (firstName || lastName || name || contactEmail || contactPhone || role || title || hasLocation) {
                // Find primary contact for this account
                let contact = await strapi.db.query('api::contact.contact').findOne({
                    where: {
                        clientAccount: account.id,
                        role: 'PRIMARY_CONTACT'
                    }
                });

                if (contact) {
                    // Update existing contact
                    const contactUpdateData = {};
                    if (firstName) contactUpdateData.firstName = firstName;
                    if (lastName) contactUpdateData.lastName = lastName;
                    if (contactEmail) contactUpdateData.email = contactEmail.toLowerCase();
                    if (contactPhone !== undefined) contactUpdateData.phone = contactPhone || null;
                    // Use role as title if provided, otherwise use title or contactTitle
                    if (role) contactUpdateData.title = role;
                    else if (title) contactUpdateData.title = title;
                    else if (contactTitle) contactUpdateData.title = contactTitle;
                    if (contactDepartment !== undefined) contactUpdateData.department = contactDepartment || null;
                    // Handle location for contact - ensure it's saved if provided and not empty
                    if (location !== undefined && location !== null) {
                        const locationStr = String(location).trim();
                        contactUpdateData.location = locationStr !== '' ? locationStr : null;
                    }
                    // Update address if provided
                    if (address !== undefined) contactUpdateData.address = address || null;

                    updatedContact = await strapi.db.query('api::contact.contact').update({
                        where: { id: contact.id },
                        data: contactUpdateData
                    });
                } else {
                    // Create primary contact if it doesn't exist (shouldn't happen but handle gracefully)
                    // We need email for contact, use account email if contactEmail not provided
                    const contactEmailToUse = contactEmail || account.email;
                    if (contactEmailToUse && firstName) {
                        updatedContact = await strapi.db.query('api::contact.contact').create({
                            data: {
                                clientAccount: account.id,
                                firstName: firstName,
                                lastName: lastName || firstName,
                                email: contactEmailToUse.toLowerCase(),
                                phone: contactPhone || null,
                                title: role || title || contactTitle || null,
                                department: contactDepartment || null,
                                location: (location !== undefined && location !== null && String(location).trim() !== '') ? String(location).trim() : null,
                                address: address || null,
                                role: 'PRIMARY_CONTACT',
                                portalAccessLevel: 'FULL_ACCESS',
                                status: 'ACTIVE',
                                source: 'ONBOARDING',
                                lastContactDate: new Date(),
                            }
                        });
                    }
                }
            }

            // Get updated account with communities
            const accountWithCommunities = await strapi.db.query('api::client-account.client-account').findOne({
                where: { id: updatedAccount.id },
                populate: ['communityMemberships']
            });

            const responseData = {
                success: true,
                message: 'Basics updated successfully',
                account: {
                    id: updatedAccount.id,
                    companyName: updatedAccount.companyName,
                    industry: updatedAccount.industry,
                    location: updatedAccount.location,
                    interests: updatedAccount.interests,
                    selectedCommunities: updatedAccount.selectedCommunities,
                    onboardingData: updatedAccount.onboardingData,
                    communityMemberships: accountWithCommunities?.communityMemberships || []
                },
                contact: updatedContact ? {
                    id: updatedContact.id,
                    firstName: updatedContact.firstName,
                    lastName: updatedContact.lastName,
                    email: updatedContact.email,
                    location: updatedContact.location
                } : null
            };

            console.log('Sending success response:', JSON.stringify(responseData, null, 2));
            return ctx.send(responseData);
        } catch (error) {
            console.error('Update basics error:', error);
            console.error('Error details:', {
                message: error.message,
                stack: error.stack,
                accountId,
                email,
                basicsKeys: basics ? Object.keys(basics) : 'basics is null/undefined',
                errorName: error.name,
                errorType: typeof error
            });

            // Ensure we return JSON even on error
            // Use ctx.internalServerError which properly formats the response
            const errorMessage = error.message || 'Failed to update basics';
            console.error('Returning error response:', errorMessage);
            return ctx.internalServerError(errorMessage);
        }
    },

    /**
     * Update selected communities during onboarding
     */
    async updateCommunities(ctx) {
        try {
            const { accountId, selectedCommunities, email } = ctx.request.body;

            if (!selectedCommunities) {
                return ctx.badRequest('Selected communities are required');
            }

            // Find account by ID or email
            let account;
            if (accountId) {
                account = await strapi.db.query('api::client-account.client-account').findOne({
                    where: { id: accountId }
                });
            } else if (email) {
                account = await strapi.db.query('api::client-account.client-account').findOne({
                    where: { email: email.toLowerCase() }
                });
            } else {
                return ctx.badRequest('Account ID or email is required');
            }

            if (!account) {
                return ctx.notFound('Account not found');
            }

            // Update account with selected communities
            const updatedAccount = await strapi.db.query('api::client-account.client-account').update({
                where: { id: account.id },
                data: {
                    selectedCommunities: selectedCommunities,
                    onboardingData: {
                        ...(account.onboardingData || {}),
                        selectedCommunities: selectedCommunities,
                        updatedAt: new Date()
                    }
                }
            });

            // Get existing memberships
            const existingMemberships = await strapi.db.query('api::community-membership.community-membership').findMany({
                where: {
                    clientAccount: account.id
                }
            });

            const existingCommunityCodes = existingMemberships.map(m => m.community);

            // Create memberships for newly selected communities
            if (Array.isArray(selectedCommunities) && selectedCommunities.length > 0) {
                for (const community of selectedCommunities) {
                    if (!existingCommunityCodes.includes(community)) {
                        // Determine membership type based on community
                        const membershipType = (community === 'XEVFIN') ? 'PREMIUM' : 'FREE';

                        await strapi.db.query('api::community-membership.community-membership').create({
                            data: {
                                clientAccount: account.id,
                                community: community,
                                membershipType: membershipType,
                                status: 'ACTIVE',
                                joinedAt: new Date(),
                                membershipData: {
                                    joinedViaOnboarding: true,
                                    initialInterests: account.onboardingData?.interests || [],
                                },
                            },
                        });
                    } else {
                        // Reactivate if it was inactive
                        const membership = existingMemberships.find(m => m.community === community);
                        if (membership && membership.status === 'INACTIVE') {
                            await strapi.db.query('api::community-membership.community-membership').update({
                                where: { id: membership.id },
                                data: {
                                    status: 'ACTIVE'
                                }
                            });
                        }
                    }
                }
            }

            // Deactivate memberships for communities that are no longer selected
            for (const membership of existingMemberships) {
                if (!selectedCommunities.includes(membership.community)) {
                    await strapi.db.query('api::community-membership.community-membership').update({
                        where: { id: membership.id },
                        data: {
                            status: 'INACTIVE'
                        }
                    });
                }
            }

            ctx.send({
                success: true,
                message: 'Communities updated successfully',
                selectedCommunities: updatedAccount.selectedCommunities
            });
        } catch (error) {
            console.error('Update communities error:', error);
            ctx.internalServerError('Failed to update communities');
        }
    },

    /**
     * Submit community application
     */
    async submitCommunityApplication(ctx) {
        try {
            const { accountId, community, submissionData, email } = ctx.request.body;

            if (!community || !submissionData) {
                return ctx.badRequest('Community and submission data are required');
            }

            // Find account by ID or email
            let account;
            if (accountId) {
                account = await strapi.db.query('api::client-account.client-account').findOne({
                    where: { id: accountId }
                });
            } else if (email) {
                account = await strapi.db.query('api::client-account.client-account').findOne({
                    where: { email: email.toLowerCase() }
                });
            } else {
                return ctx.badRequest('Account ID or email is required');
            }

            if (!account) {
                return ctx.notFound('Account not found');
            }

            const submissionId = `${account.id}-${community}-${Date.now()}`;

            // Create community submission
            const submission = await strapi.db.query('api::community-submission.community-submission').create({
                data: {
                    clientAccount: account.id,
                    community: community,
                    submissionData: submissionData,
                    submissionId: submissionId,
                    status: 'SUBMITTED',
                },
            });

            ctx.send({
                success: true,
                message: 'Application submitted successfully',
                submission: {
                    id: submission.id,
                    submissionId: submission.submissionId,
                    community: submission.community,
                    status: submission.status
                }
            });
        } catch (error) {
            console.error('Submit community application error:', error);
            ctx.internalServerError('Failed to submit application');
        }
    },

    /**
     * Get account data for onboarding
     */
    async getAccountData(ctx) {
        try {
            const { email } = ctx.query;

            if (!email) {
                return ctx.badRequest('Email is required');
            }

            // Find account by email
            const account = await strapi.db.query('api::client-account.client-account').findOne({
                where: { email: email.toLowerCase() },
                populate: ['communitySubmissions', 'communityMemberships']
            });

            if (!account) {
                return ctx.notFound('Account not found');
            }

            ctx.send({
                account: {
                    id: account.id,
                    email: account.email,
                    companyName: account.companyName,
                    industry: account.industry,
                    location: account.location,
                    interests: account.interests,
                    onboardingCompleted: account.onboardingCompleted,
                    onboardingData: account.onboardingData,
                    selectedCommunities: account.selectedCommunities,
                    communitySubmissions: account.communitySubmissions,
                    communityMemberships: account.communityMemberships
                }
            });
        } catch (error) {
            console.error('Get account data error:', error);
            ctx.internalServerError('Failed to get account data');
        }
    }
};



