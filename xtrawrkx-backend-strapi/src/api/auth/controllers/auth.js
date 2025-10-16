'use strict';

const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const activityLogger = require('../../../services/activityLogger');

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
            let user = await strapi.db.query('api::xtrawrkx-user.xtrawrkx-user').findOne({
                where: {
                    email: email.toLowerCase(),
                    isActive: true
                }
            });

            // If user found, populate the relations
            if (user) {
                user = await strapi.db.query('api::xtrawrkx-user.xtrawrkx-user').findOne({
                    where: { id: user.id },
                    populate: {
                        primaryRole: true,
                        userRoles: true
                    }
                });
            }

            console.log('Found user:', user ? 'Yes' : 'No');

            if (!user) {
                // For development, create a default admin user if none exists
                if (email.toLowerCase() === 'admin@xtrawrkx.com' && password === 'password1234') {
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
                            role: user.primaryRole?.name || 'ADMIN',
                            department: user.department
                        });

                        console.log('JWT token generated successfully');

                        // Log the login activity
                        try {
                            await activityLogger.logLogin(
                                user.id.toString(),
                                ctx.request.ip,
                                ctx.request.headers['user-agent']
                            );
                        } catch (logError) {
                            console.log('Failed to log login activity:', logError.message);
                        }

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
                role: user.primaryRole?.name || 'DEVELOPER',
                department: user.department
            });

            // Log the login activity
            try {
                await activityLogger.logLogin(
                    user.id.toString(),
                    ctx.request.ip,
                    ctx.request.headers['user-agent']
                );
            } catch (logError) {
                console.log('Failed to log login activity:', logError.message);
            }

            ctx.send({
                user: {
                    id: user.id,
                    email: user.email,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    name: `${user.firstName} ${user.lastName}`.trim(),
                    role: user.primaryRole?.name || 'DEVELOPER',
                    primaryRole: user.primaryRole,
                    userRoles: user.userRoles,
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
                primaryRole,
                department,
                phone,
                password,
                sendInvitation = true
            } = ctx.request.body;

            // Temporarily skip authentication for testing
            console.log('CreateInternalUser called - temporarily skipping auth for debugging');

            if (!email || !firstName || !lastName || !department) {
                return ctx.badRequest('Required fields: email, firstName, lastName, department');
            }

            // Validate custom password if provided
            if (password && password.length < 8) {
                return ctx.badRequest('Custom password must be at least 8 characters long');
            }

            // Check if user already exists
            const existingUser = await strapi.db.query('api::xtrawrkx-user.xtrawrkx-user').findOne({
                where: { email: email.toLowerCase() },
            });

            if (existingUser) {
                return ctx.badRequest('User with this email already exists');
            }

            // Validate primary role if provided
            let primaryRoleData = null;
            if (primaryRole) {
                primaryRoleData = await strapi.db.query('api::user-role.user-role').findOne({
                    where: { id: primaryRole }
                });

                if (!primaryRoleData) {
                    return ctx.badRequest('Invalid primary role specified');
                }
            }

            // Use custom password if provided, otherwise generate a random one
            let tempPassword;
            if (password && password.length >= 8) {
                tempPassword = password;
                console.log('=== USING CUSTOM PASSWORD ===');
                console.log('Email:', email);
                console.log('Custom Password:', tempPassword);
                console.log('=============================');
            } else {
                tempPassword = crypto.randomBytes(12).toString('hex');
                console.log('=== GENERATED RANDOM PASSWORD ===');
                console.log('Email:', email);
                console.log('Generated Password:', tempPassword);
                console.log('=================================');
            }

            const hashedPassword = await bcrypt.hash(tempPassword, 12);
            const invitationToken = crypto.randomBytes(32).toString('hex');
            const invitationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

            // Prepare user data
            const userData = {
                email: email.toLowerCase(),
                firstName,
                lastName,
                phone,
                password: hashedPassword,
                department,
                authProvider: 'PASSWORD',
                emailVerified: false,
                isActive: true,
                invitationToken,
                invitationExpires,
                invitedBy: 1, // Temporary: use admin user ID
            };

            // Add primary role if specified
            if (primaryRole) {
                userData.primaryRole = primaryRole;
            }

            // Create user
            const user = await strapi.db.query('api::xtrawrkx-user.xtrawrkx-user').create({
                data: userData,
                populate: {
                    primaryRole: true
                }
            });

            // Log the user creation activity
            try {
                await activityLogger.logActivity({
                    userId: '1', // Using admin user ID temporarily
                    action: 'New user created',
                    description: `Created account for ${firstName} ${lastName} (${email}) with role ${primaryRoleData?.name || 'User'}`,
                    type: 'ADMIN',
                    activityType: 'USER_CREATION',
                    entityType: 'USER_ACCOUNT',
                    entityId: user.id.toString(),
                    ipAddress: ctx.request.ip,
                    userAgent: ctx.request.headers['user-agent'],
                    status: 'COMPLETED'
                });
            } catch (logError) {
                console.log('Failed to log user creation activity:', logError.message);
            }

            // Send invitation email if requested
            if (sendInvitation) {
                try {
                    const roleName = primaryRoleData ? primaryRoleData.name : 'User';
                    await strapi.plugins['email'].services.email.send({
                        to: email,
                        subject: 'Welcome to XtraWrkx - Account Created',
                        html: `
                            <h2>Welcome to XtraWrkx!</h2>
                            <p>Hello ${firstName},</p>
                            <p>Your account has been created with the role of ${roleName}. Here are your login credentials:</p>
                            <p><strong>Email:</strong> ${email}</p>
                            <p><strong>Temporary Password:</strong> ${tempPassword}</p>
                            <p>Please login and change your password immediately.</p>
                            <p><a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/auth/login">Login Here</a></p>
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
                    primaryRole: user.primaryRole,
                    department: user.department,
                    isActive: user.isActive,
                },
                tempPassword: sendInvitation ? null : tempPassword, // Only return password if not sending email
                message: sendInvitation
                    ? 'User created and invitation email sent'
                    : 'User created successfully',
                passwordType: password ? 'custom' : 'generated'
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
            console.log('=== GET CURRENT USER CALLED ===');

            // Get token from headers
            const token = ctx.request.headers.authorization?.replace('Bearer ', '');

            if (!token) {
                console.log('No token provided');
                return ctx.unauthorized('No token provided');
            }

            let decoded;
            try {
                decoded = strapi.plugins['users-permissions'].services.jwt.verify(token);
                console.log('Token decoded:', decoded);
            } catch (jwtError) {
                console.log('JWT verification failed:', jwtError.message);
                return ctx.unauthorized('Invalid token');
            }

            if (decoded.type !== 'internal') {
                return ctx.unauthorized('Invalid token type');
            }

            // Get user with populated relations
            const user = await strapi.db.query('api::xtrawrkx-user.xtrawrkx-user').findOne({
                where: { id: decoded.id, isActive: true },
                populate: {
                    primaryRole: true,
                    userRoles: true
                }
            });

            if (!user) {
                return ctx.unauthorized('User not found or inactive');
            }

            // Get the role name from primaryRole or fallback to user.role
            let roleName = user.role;
            if (user.primaryRole) {
                roleName = user.primaryRole.name;
            }

            const userData = {
                id: user.id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                name: `${user.firstName} ${user.lastName}`.trim(),
                role: roleName,
                department: user.department,
                phone: user.phone,
                location: user.location || '',
                timezone: user.timezone || 'America/New_York',
                bio: user.bio || '',
                isActive: user.isActive,
                emailVerified: user.emailVerified,
                createdAt: user.createdAt,
                lastLogin: user.lastLoginAt,
                avatar: user.avatar,
                primaryRole: user.primaryRole,
                userRoles: user.userRoles
            };

            console.log('Returning user data:', userData);

            return ctx.send({
                success: true,
                type: 'internal',
                user: userData
            });
        } catch (error) {
            console.error('Get current user error:', error);
            console.error('Error stack:', error.stack);
            ctx.internalServerError('Failed to get user information');
        }
    },

    /**
     * Update user profile
     */
    async updateProfile(ctx) {
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

            const {
                firstName,
                lastName,
                phone,
                location,
                timezone,
                bio
            } = ctx.request.body;

            // Validate required fields
            if (!firstName || !lastName) {
                return ctx.badRequest('First name and last name are required');
            }

            if (decoded.type === 'internal') {
                // Update internal user
                const updatedUser = await strapi.db.query('api::xtrawrkx-user.xtrawrkx-user').update({
                    where: { id: decoded.id },
                    data: {
                        firstName: firstName.trim(),
                        lastName: lastName.trim(),
                        phone: phone ? phone.trim() : null,
                        location: location ? location.trim() : null,
                        timezone: timezone || 'America/New_York',
                        bio: bio ? bio.trim() : null,
                        updatedAt: new Date(),
                    },
                });

                if (!updatedUser) {
                    return ctx.notFound('User not found');
                }

                // Log the profile update activity
                try {
                    const updatedFields = { firstName, lastName, phone, location, timezone, bio };
                    await activityLogger.logProfileUpdate(
                        updatedUser.id.toString(),
                        updatedFields,
                        ctx.request.ip,
                        ctx.request.headers['user-agent']
                    );
                } catch (logError) {
                    console.log('Failed to log profile update activity:', logError.message);
                }

                ctx.send({
                    success: true,
                    message: 'Profile updated successfully',
                    user: {
                        id: updatedUser.id,
                        firstName: updatedUser.firstName,
                        lastName: updatedUser.lastName,
                        phone: updatedUser.phone,
                        location: updatedUser.location,
                        timezone: updatedUser.timezone,
                        bio: updatedUser.bio,
                    }
                });
            } else if (decoded.type === 'client') {
                // For client accounts, we might want to update contact information
                // This would depend on your specific requirements
                return ctx.badRequest('Profile updates for client accounts not implemented yet');
            } else {
                return ctx.badRequest('Invalid token type');
            }
        } catch (error) {
            console.error('Update profile error:', error);
            ctx.internalServerError('Failed to update profile');
        }
    },

    /**
     * Upload user avatar
     */
    async uploadAvatar(ctx) {
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

            if (decoded.type !== 'internal') {
                return ctx.badRequest('Avatar upload only available for internal users');
            }

            // Check if file was uploaded
            const files = ctx.request.files;
            if (!files || !files.avatar) {
                return ctx.badRequest('No avatar file provided');
            }

            const avatarFile = files.avatar;

            // Validate file type
            const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
            if (!allowedTypes.includes(avatarFile.type)) {
                return ctx.badRequest('Invalid file type. Please upload JPEG, PNG, or WebP images only.');
            }

            // Validate file size (max 5MB)
            const maxSize = 5 * 1024 * 1024; // 5MB
            if (avatarFile.size > maxSize) {
                return ctx.badRequest('File size too large. Maximum size is 5MB.');
            }

            // Upload file using Strapi's upload service
            const uploadedFiles = await strapi.plugins.upload.services.upload.upload({
                data: {
                    refId: decoded.id,
                    ref: 'api::xtrawrkx-user.xtrawrkx-user',
                    field: 'avatar',
                },
                files: avatarFile,
            });

            if (!uploadedFiles || uploadedFiles.length === 0) {
                return ctx.internalServerError('Failed to upload avatar');
            }

            const uploadedFile = uploadedFiles[0];

            // Update user with new avatar
            const updatedUser = await strapi.db.query('api::xtrawrkx-user.xtrawrkx-user').update({
                where: { id: decoded.id },
                data: {
                    avatar: uploadedFile.id,
                },
                populate: {
                    avatar: true,
                },
            });

            if (!updatedUser) {
                return ctx.notFound('User not found');
            }

            // Log the avatar upload activity
            try {
                await activityLogger.logAvatarUpload(
                    updatedUser.id.toString(),
                    ctx.request.ip,
                    ctx.request.headers['user-agent']
                );
            } catch (logError) {
                console.log('Failed to log avatar upload activity:', logError.message);
            }

            // Return success response with avatar URL
            ctx.send({
                success: true,
                message: 'Avatar uploaded successfully',
                avatarUrl: updatedUser.avatar?.url || null,
                avatar: updatedUser.avatar,
            });
        } catch (error) {
            console.error('Upload avatar error:', error);
            ctx.internalServerError('Failed to upload avatar');
        }
    },

    /**
     * Change user password
     */
    async changePassword(ctx) {
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

            if (decoded.type !== 'internal') {
                return ctx.badRequest('Password change only available for internal users');
            }

            const { currentPassword, newPassword } = ctx.request.body;

            // Validate input
            if (!currentPassword || !newPassword) {
                return ctx.badRequest('Current password and new password are required');
            }

            // Validate new password strength
            if (newPassword.length < 8) {
                return ctx.badRequest('New password must be at least 8 characters long');
            }

            // Get current user
            const user = await strapi.db.query('api::xtrawrkx-user.xtrawrkx-user').findOne({
                where: { id: decoded.id },
            });

            if (!user) {
                return ctx.notFound('User not found');
            }

            // Verify current password
            const bcrypt = require('bcryptjs');
            const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password);

            if (!isCurrentPasswordValid) {
                return ctx.badRequest('Current password is incorrect');
            }

            // Hash new password
            const hashedNewPassword = await bcrypt.hash(newPassword, 12);

            // Update user password
            await strapi.db.query('api::xtrawrkx-user.xtrawrkx-user').update({
                where: { id: decoded.id },
                data: {
                    password: hashedNewPassword,
                    updatedAt: new Date(),
                },
            });

            // Log the password change activity
            try {
                await activityLogger.logPasswordChange(
                    decoded.id.toString(),
                    ctx.request.ip,
                    ctx.request.headers['user-agent']
                );
            } catch (logError) {
                console.log('Failed to log password change activity:', logError.message);
            }

            ctx.send({
                success: true,
                message: 'Password changed successfully',
            });
        } catch (error) {
            console.error('Change password error:', error);
            ctx.internalServerError('Failed to change password');
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
    },

    /**
     * Debug JWT token verification
     */
    async debugToken(ctx) {
        try {
            const token = ctx.request.headers.authorization?.replace('Bearer ', '');

            if (!token) {
                return ctx.send({ error: 'No token provided' });
            }

            try {
                const decoded = strapi.plugins['users-permissions'].services.jwt.verify(token);
                return ctx.send({
                    success: true,
                    decoded: decoded,
                    tokenLength: token.length
                });
            } catch (jwtError) {
                return ctx.send({
                    success: false,
                    error: jwtError.message,
                    tokenLength: token.length,
                    tokenStart: token.substring(0, 50)
                });
            }
        } catch (error) {
            return ctx.send({ error: error.message });
        }
    },

    async getUserActivities(ctx) {
        try {
            console.log('=== GET USER ACTIVITIES CALLED ===');

            // For now, we'll use a mock user ID since we're bypassing auth
            // In a real implementation, this would come from the authenticated user
            const userId = '1'; // Mock user ID

            // Get real activities from the activity logger
            let realActivities = [];
            try {
                realActivities = await activityLogger.getUserActivities(userId, 20);
            } catch (error) {
                console.log('Error fetching real activities:', error.message);
            }

            // Only show real activities - no sample data
            let activities = realActivities;

            console.log(`Returning ${activities.length} activities for user ${userId}`);

            return ctx.send({
                success: true,
                activities: activities,
                total: activities.length
            });

        } catch (error) {
            console.error('Get user activities error:', error);
            console.error('Error stack:', error.stack);
            ctx.internalServerError('Failed to fetch user activities');
        }
    },

    async getAllActivities(ctx) {
        try {
            console.log('=== GET ALL ACTIVITIES CALLED ===');

            // Get query parameters
            const { limit = 50, type, timeRange, search } = ctx.query;

            // Get all activities from the activity logger
            let activities = [];
            try {
                activities = await activityLogger.getAllActivities(parseInt(limit), type, timeRange);
            } catch (error) {
                console.log('Error fetching all activities:', error.message);
            }

            // No fallback data - only show real activities
            console.log(`Found ${activities.length} real activities`);

            // Apply search filter if provided
            if (search && search.trim()) {
                const searchTerm = search.toLowerCase().trim();
                activities = activities.filter(activity =>
                    activity.action.toLowerCase().includes(searchTerm) ||
                    activity.description.toLowerCase().includes(searchTerm) ||
                    activity.type.toLowerCase().includes(searchTerm)
                );
            }

            // Get activity statistics
            const stats = await activityLogger.getActivityStats();

            console.log(`Returning ${activities.length} total activities`);

            return ctx.send({
                success: true,
                activities: activities,
                total: activities.length,
                stats: stats
            });

        } catch (error) {
            console.error('Get all activities error:', error);
            console.error('Error stack:', error.stack);
            ctx.internalServerError('Failed to fetch all activities');
        }
    },

    async getActivityStats(ctx) {
        try {
            console.log('=== GET ACTIVITY STATS CALLED ===');

            const stats = await activityLogger.getActivityStats();

            return ctx.send({
                success: true,
                stats: stats
            });

        } catch (error) {
            console.error('Get activity stats error:', error);
            ctx.internalServerError('Failed to fetch activity statistics');
        }
    },

    async clearAllActivities(ctx) {
        try {
            console.log('=== CLEAR ALL ACTIVITIES CALLED ===');

            // Clear all activities
            if (global.userActivities) {
                global.userActivities = [];
            }

            const stats = await activityLogger.getActivityStats();

            return ctx.send({
                success: true,
                message: `Cleared all activities. System will now only show real activities from user actions.`,
                stats: stats
            });

        } catch (error) {
            console.error('Clear all activities error:', error);
            ctx.internalServerError('Failed to clear activities');
        }
    }
};

