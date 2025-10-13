'use strict';

const crypto = require('crypto');
const bcrypt = require('bcryptjs');

/**
 * Authentication Controller
 * Handles authentication for both internal users and client accounts
 */
module.exports = {
    /**
     * Internal user login (XtraWrkx employees)
     */
    async internalLogin(ctx) {
        try {
            console.log('Internal login attempt:', ctx.request.body);
            const { email, password } = ctx.request.body;

            if (!email || !password) {
                return ctx.badRequest('Email and password are required');
            }

            console.log('Looking for user with email:', email.toLowerCase());

            // Find user by email
            const user = await strapi.db.query('api::xtrawrkx-user.xtrawrkx-user').findOne({
                where: {
                    email: email.toLowerCase(),
                    isActive: true
                },
            });

            console.log('Found user:', user ? 'Yes' : 'No');

            if (!user) {
                // For development, create a default admin user if none exists
                if (email.toLowerCase() === 'admin@xtrawrkx.com' && password === 'admin123') {
                    console.log('Creating default admin user for development');

                    try {
                        const bcrypt = require('bcryptjs');
                        const hashedPassword = await bcrypt.hash(password, 12);

                        console.log('Password hashed successfully');

                        // Check if user already exists (in case of race condition)
                        const existingUser = await strapi.db.query('api::xtrawrkx-user.xtrawrkx-user').findOne({
                            where: { email: email.toLowerCase() }
                        });

                        if (existingUser) {
                            console.log('User already exists, proceeding with login');
                            user = existingUser;
                        } else {
                            const newUser = await strapi.db.query('api::xtrawrkx-user.xtrawrkx-user').create({
                                data: {
                                    email: email.toLowerCase(),
                                    firstName: 'Admin',
                                    lastName: 'User',
                                    password: hashedPassword,
                                    role: 'ADMIN',
                                    department: 'MANAGEMENT',
                                    isActive: true,
                                    emailVerified: true,
                                    authProvider: 'PASSWORD',
                                    lastLoginAt: new Date(),
                                },
                            });

                            console.log('User created successfully:', newUser.id);
                            user = newUser;
                        }

                        // Generate JWT token
                        const jwt = strapi.plugins['users-permissions'].services.jwt.issue({
                            id: user.id,
                            email: user.email,
                            type: 'internal',
                            role: user.role,
                            department: user.department
                        });

                        console.log('JWT token generated successfully');

                        return ctx.send({
                            user: {
                                id: user.id,
                                email: user.email,
                                firstName: user.firstName,
                                lastName: user.lastName,
                                name: `${user.firstName} ${user.lastName}`.trim(),
                                role: user.role,
                                department: user.department,
                                isActive: user.isActive,
                                emailVerified: user.emailVerified,
                            },
                            token: jwt,
                        });
                    } catch (createError) {
                        console.error('Error creating user:', createError);
                        return ctx.internalServerError('Failed to create user: ' + createError.message);
                    }
                }
                console.log('Invalid credentials - user not found and not default admin');
                return ctx.badRequest('Invalid credentials');
            }

            // Verify password
            const isValidPassword = await bcrypt.compare(password, user.password);
            if (!isValidPassword) {
                return ctx.badRequest('Invalid credentials');
            }

            // Update last login
            await strapi.db.query('api::xtrawrkx-user.xtrawrkx-user').update({
                where: { id: user.id },
                data: { lastLoginAt: new Date() },
            });

            // Generate JWT token
            const jwt = strapi.plugins['users-permissions'].services.jwt.issue({
                id: user.id,
                email: user.email,
                type: 'internal',
                role: user.role,
                department: user.department
            });

            ctx.send({
                user: {
                    id: user.id,
                    email: user.email,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    name: `${user.firstName} ${user.lastName}`.trim(),
                    role: user.role,
                    department: user.department,
                    isActive: user.isActive,
                    emailVerified: user.emailVerified,
                },
                token: jwt,
            });
        } catch (error) {
            console.error('Internal login error:', error);
            ctx.internalServerError('Authentication failed');
        }
    },

    /**
     * Client account login (Client portal users)
     */
    async clientLogin(ctx) {
        try {
            const { email, password } = ctx.request.body;

            if (!email || !password) {
                return ctx.badRequest('Email and password are required');
            }

            // Find account by email
            const account = await strapi.db.query('api::account.account').findOne({
                where: {
                    email: email.toLowerCase(),
                    isActive: true
                },
                populate: {
                    contacts: {
                        where: { status: 'ACTIVE' },
                        select: ['id', 'firstName', 'lastName', 'email', 'role', 'portalAccessLevel']
                    }
                }
            });

            if (!account) {
                return ctx.badRequest('Invalid credentials');
            }

            // Verify password
            const isValidPassword = await bcrypt.compare(password, account.password);
            if (!isValidPassword) {
                return ctx.badRequest('Invalid credentials');
            }

            // Update last login
            await strapi.db.query('api::account.account').update({
                where: { id: account.id },
                data: { lastLoginAt: new Date() },
            });

            // Generate JWT token
            const jwt = strapi.plugins['users-permissions'].services.jwt.issue({
                id: account.id,
                email: account.email,
                type: 'client',
                companyName: account.companyName
            });

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
                contacts: account.contacts,
                token: jwt,
            });
        } catch (error) {
            console.error('Client login error:', error);
            ctx.internalServerError('Authentication failed');
        }
    },

    /**
     * Create internal user (Super admin only)
     */
    async createInternalUser(ctx) {
        try {
            const {
                email,
                firstName,
                lastName,
                role,
                department,
                phone,
                sendInvitation = true
            } = ctx.request.body;

            // Verify current user is admin
            const currentUser = ctx.state.user;
            if (!currentUser || currentUser.role !== 'ADMIN') {
                return ctx.forbidden('Only admins can create users');
            }

            if (!email || !firstName || !lastName || !role || !department) {
                return ctx.badRequest('Required fields: email, firstName, lastName, role, department');
            }

            // Check if user already exists
            const existingUser = await strapi.db.query('api::xtrawrkx-user.xtrawrkx-user').findOne({
                where: { email: email.toLowerCase() },
            });

            if (existingUser) {
                return ctx.badRequest('User with this email already exists');
            }

            // Generate temporary password and invitation token
            const tempPassword = crypto.randomBytes(12).toString('hex');
            const hashedPassword = await bcrypt.hash(tempPassword, 12);
            const invitationToken = crypto.randomBytes(32).toString('hex');
            const invitationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

            // Create user
            const user = await strapi.db.query('api::xtrawrkx-user.xtrawrkx-user').create({
                data: {
                    email: email.toLowerCase(),
                    firstName,
                    lastName,
                    phone,
                    password: hashedPassword,
                    role,
                    department,
                    authProvider: 'PASSWORD',
                    emailVerified: false,
                    isActive: true,
                    invitationToken,
                    invitationExpires,
                    invitedBy: currentUser.id,
                },
            });

            // Send invitation email if requested
            if (sendInvitation) {
                try {
                    await strapi.plugins['email'].services.email.send({
                        to: email,
                        subject: 'Welcome to XtraWrkx - Account Created',
                        html: `
                            <h2>Welcome to XtraWrkx!</h2>
                            <p>Hello ${firstName},</p>
                            <p>Your account has been created. Here are your login credentials:</p>
                            <p><strong>Email:</strong> ${email}</p>
                            <p><strong>Temporary Password:</strong> ${tempPassword}</p>
                            <p>Please login and change your password immediately.</p>
                            <p><a href="${process.env.FRONTEND_URL}/auth/login">Login Here</a></p>
                        `
                    });
                } catch (emailError) {
                    console.error('Failed to send invitation email:', emailError);
                    // Don't fail the user creation if email fails
                }
            }

            ctx.send({
                user: {
                    id: user.id,
                    email: user.email,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    role: user.role,
                    department: user.department,
                    isActive: user.isActive,
                },
                tempPassword: sendInvitation ? null : tempPassword, // Only return password if not sending email
                message: sendInvitation
                    ? 'User created and invitation email sent'
                    : 'User created successfully'
            });
        } catch (error) {
            console.error('Create internal user error:', error);
            ctx.internalServerError('Failed to create user');
        }
    },

    /**
     * Get current user information
     */
    async getCurrentUser(ctx) {
        try {
            const token = ctx.request.headers.authorization?.replace('Bearer ', '');

            if (!token) {
                return ctx.unauthorized('No token provided');
            }

            let decoded;
            try {
                decoded = strapi.plugins['users-permissions'].services.jwt.verify(token);
            } catch (error) {
                return ctx.unauthorized('Invalid token');
            }

            if (decoded.type === 'internal') {
                // Internal user
                const user = await strapi.db.query('api::xtrawrkx-user.xtrawrkx-user').findOne({
                    where: { id: decoded.id },
                });

                if (!user) {
                    return ctx.notFound('User not found');
                }

                ctx.send({
                    type: 'internal',
                    user: {
                        id: user.id,
                        email: user.email,
                        firstName: user.firstName,
                        lastName: user.lastName,
                        name: `${user.firstName} ${user.lastName}`.trim(),
                        role: user.role,
                        department: user.department,
                        isActive: user.isActive,
                        emailVerified: user.emailVerified,
                    }
                });
            } else if (decoded.type === 'client') {
                // Client account
                const account = await strapi.db.query('api::account.account').findOne({
                    where: { id: decoded.id },
                    populate: {
                        contacts: {
                            where: { status: 'ACTIVE' },
                            select: ['id', 'firstName', 'lastName', 'email', 'role', 'portalAccessLevel']
                        }
                    }
                });

                if (!account) {
                    return ctx.notFound('Account not found');
                }

                ctx.send({
                    type: 'client',
                    account: {
                        id: account.id,
                        email: account.email,
                        companyName: account.companyName,
                        industry: account.industry,
                        type: account.type,
                        isActive: account.isActive,
                        emailVerified: account.emailVerified,
                    },
                    contacts: account.contacts
                });
            } else {
                return ctx.badRequest('Invalid token type');
            }
        } catch (error) {
            console.error('Get current user error:', error);
            ctx.internalServerError('Failed to get user information');
        }
    },

    /**
     * Request password reset
     */
    async requestPasswordReset(ctx) {
        try {
            const { email, type = 'internal' } = ctx.request.body;

            if (!email) {
                return ctx.badRequest('Email is required');
            }

            let user, query;
            if (type === 'internal') {
                query = 'api::xtrawrkx-user.xtrawrkx-user';
            } else {
                query = 'api::account.account';
            }

            user = await strapi.db.query(query).findOne({
                where: { email: email.toLowerCase() },
            });

            if (!user) {
                // Don't reveal if user exists or not
                return ctx.send({ message: 'If the email exists, a reset link has been sent' });
            }

            // Generate reset token
            const resetToken = crypto.randomBytes(32).toString('hex');
            const resetExpires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

            // Update user with reset token
            await strapi.db.query(query).update({
                where: { id: user.id },
                data: {
                    passwordResetToken: resetToken,
                    passwordResetExpires: resetExpires,
                },
            });

            // Send reset email
            try {
                const resetUrl = `${process.env.FRONTEND_URL}/auth/reset-password?token=${resetToken}&type=${type}`;
                await strapi.plugins['email'].services.email.send({
                    to: email,
                    subject: 'Password Reset Request',
                    html: `
                        <h2>Password Reset Request</h2>
                        <p>You requested a password reset. Click the link below to reset your password:</p>
                        <p><a href="${resetUrl}">Reset Password</a></p>
                        <p>This link will expire in 1 hour.</p>
                        <p>If you didn't request this, please ignore this email.</p>
                    `
                });
            } catch (emailError) {
                console.error('Failed to send reset email:', emailError);
                return ctx.internalServerError('Failed to send reset email');
            }

            ctx.send({ message: 'If the email exists, a reset link has been sent' });
        } catch (error) {
            console.error('Password reset request error:', error);
            ctx.internalServerError('Failed to process reset request');
        }
    },

    /**
     * Reset password with token
     */
    async resetPassword(ctx) {
        try {
            const { token, password, type = 'internal' } = ctx.request.body;

            if (!token || !password) {
                return ctx.badRequest('Token and password are required');
            }

            if (password.length < 8) {
                return ctx.badRequest('Password must be at least 8 characters long');
            }

            let user, query;
            if (type === 'internal') {
                query = 'api::xtrawrkx-user.xtrawrkx-user';
            } else {
                query = 'api::account.account';
            }

            // Find user with valid reset token
            user = await strapi.db.query(query).findOne({
                where: {
                    passwordResetToken: token,
                    passwordResetExpires: { $gt: new Date() },
                },
            });

            if (!user) {
                return ctx.badRequest('Invalid or expired reset token');
            }

            // Hash new password
            const hashedPassword = await bcrypt.hash(password, 12);

            // Update user password and clear reset token
            await strapi.db.query(query).update({
                where: { id: user.id },
                data: {
                    password: hashedPassword,
                    passwordResetToken: null,
                    passwordResetExpires: null,
                },
            });

            ctx.send({ message: 'Password reset successfully' });
        } catch (error) {
            console.error('Password reset error:', error);
            ctx.internalServerError('Failed to reset password');
        }
    }
};

