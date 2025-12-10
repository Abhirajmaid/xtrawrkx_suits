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

                // Primary contact information
                contactFirstName,
                contactLastName,
                contactEmail,
                contactPhone,
                contactTitle,
                contactDepartment,

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
                employees,
                description,
                founded,
                lastActivity: new Date(),
                onboardingCompleted: true,
                onboardingCompletedAt: new Date(),
                onboardingData: onboardingData,
                selectedCommunities: onboardingData.selectedCommunities || [],
            };

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

            ctx.send({
                success: true,
                account: {
                    id: account.id,
                    email: account.email,
                    companyName: account.companyName,
                    industry: account.industry,
                    type: account.type,
                    isActive: account.isActive,
                    emailVerified: account.emailVerified,
                    onboardingCompleted: account.onboardingCompleted,
                },
                primaryContact: {
                    id: contact.id,
                    firstName: contact.firstName,
                    lastName: contact.lastName,
                    email: contact.email,
                    role: contact.role,
                    portalAccessLevel: contact.portalAccessLevel,
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
        try {
            const { accountId, basics, email } = ctx.request.body;

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

            // Extract company and contact data from basics
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
            } = basics;

            // Parse name if provided as single field
            let firstName = contactFirstName;
            let lastName = contactLastName;
            if (name && !contactFirstName) {
                const nameParts = name.trim().split(' ');
                firstName = nameParts[0] || '';
                lastName = nameParts.slice(1).join(' ') || '';
            }

            // Update account with company basics
            const updateData = {
                onboardingData: {
                    ...basics,
                    updatedAt: new Date()
                }
            };

            // Update company fields if provided
            if (companyName) updateData.companyName = companyName;
            if (industry) updateData.industry = industry;
            if (website !== undefined) updateData.website = website;
            if (phone) updateData.phone = phone;
            if (address !== undefined) updateData.address = address;
            if (city) updateData.city = city;
            if (state) updateData.state = state;
            if (zipCode) updateData.zipCode = zipCode;
            if (country) updateData.country = country;
            if (employees) updateData.employees = employees;
            if (description !== undefined) updateData.description = description;
            if (founded) updateData.founded = founded;

            const updatedAccount = await strapi.db.query('api::client-account.client-account').update({
                where: { id: account.id },
                data: updateData
            });

            // Update primary contact if contact data is provided
            let updatedContact = null;
            if (firstName || lastName || name || contactEmail || contactPhone || role || title) {
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
                    if (contactPhone) contactUpdateData.phone = contactPhone;
                    // Use role as title if provided, otherwise use title or contactTitle
                    if (role) contactUpdateData.title = role;
                    else if (title) contactUpdateData.title = title;
                    else if (contactTitle) contactUpdateData.title = contactTitle;
                    if (contactDepartment) contactUpdateData.department = contactDepartment;

                    updatedContact = await strapi.db.query('api::contact.contact').update({
                        where: { id: contact.id },
                        data: contactUpdateData
                    });
                }
            }

            ctx.send({
                success: true,
                message: 'Basics updated successfully',
                account: {
                    id: updatedAccount.id,
                    companyName: updatedAccount.companyName,
                    industry: updatedAccount.industry,
                    onboardingData: updatedAccount.onboardingData
                },
                contact: updatedContact ? {
                    id: updatedContact.id,
                    firstName: updatedContact.firstName,
                    lastName: updatedContact.lastName,
                    email: updatedContact.email
                } : null
            });
        } catch (error) {
            console.error('Update basics error:', error);
            ctx.internalServerError('Failed to update basics');
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



