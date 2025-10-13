'use strict';

const crypto = require('crypto');
const bcrypt = require('bcryptjs');

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

            // Check if account already exists
            const existingAccount = await strapi.db.query('api::account.account').findOne({
                where: {
                    $or: [
                        { email: email.toLowerCase() },
                        { companyName: companyName }
                    ]
                },
            });

            if (existingAccount) {
                return ctx.badRequest('Account with this email or company name already exists');
            }

            // Check if contact email already exists
            const existingContact = await strapi.db.query('api::contact.contact').findOne({
                where: { email: contactEmail.toLowerCase() },
            });

            if (existingContact) {
                return ctx.badRequest('Contact with this email already exists');
            }

            // Hash password
            const hashedPassword = await bcrypt.hash(password, 12);

            // Create account
            const account = await strapi.db.query('api::account.account').create({
                data: {
                    companyName,
                    industry,
                    type: 'CUSTOMER',
                    website,
                    phone,
                    email: email.toLowerCase(),
                    address,
                    city,
                    state,
                    zipCode,
                    country,
                    employees,
                    description,
                    founded,
                    password: hashedPassword,
                    emailVerified: false,
                    isActive: true,
                    source: 'ONBOARDING',
                    lastActivity: new Date(),
                },
            });

            // Create primary contact
            const contact = await strapi.db.query('api::contact.contact').create({
                data: {
                    account: account.id,
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

            // Generate JWT token for immediate login
            const jwt = strapi.plugins['users-permissions'].services.jwt.issue({
                id: account.id,
                email: account.email,
                type: 'client',
                companyName: account.companyName
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
                account: {
                    id: account.id,
                    email: account.email,
                    companyName: account.companyName,
                    industry: account.industry,
                    type: account.type,
                    isActive: account.isActive,
                    emailVerified: account.emailVerified,
                },
                primaryContact: {
                    id: contact.id,
                    firstName: contact.firstName,
                    lastName: contact.lastName,
                    email: contact.email,
                    role: contact.role,
                    portalAccessLevel: contact.portalAccessLevel,
                },
                token: jwt,
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
                    account: currentUser.id,
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
    }
};



