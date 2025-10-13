'use strict';

/**
 * Authentication middleware
 */
module.exports = (config, { strapi }) => {
    return async (ctx, next) => {
        try {
            const token = ctx.request.headers.authorization?.replace('Bearer ', '');

            if (!token) {
                return ctx.unauthorized('No token provided');
            }

            const decoded = strapi.plugins['users-permissions'].services.jwt.verify(token);

            // Set user context based on token type
            if (decoded.type === 'internal') {
                const user = await strapi.db.query('api::xtrawrkx-user.xtrawrkx-user').findOne({
                    where: { id: decoded.id, isActive: true },
                });

                if (!user) {
                    return ctx.unauthorized('User not found or inactive');
                }

                ctx.state.user = {
                    ...user,
                    type: 'internal'
                };
            } else if (decoded.type === 'client') {
                const account = await strapi.db.query('api::account.account').findOne({
                    where: { id: decoded.id, isActive: true },
                    populate: {
                        contacts: {
                            where: { status: 'ACTIVE' }
                        }
                    }
                });

                if (!account) {
                    return ctx.unauthorized('Account not found or inactive');
                }

                ctx.state.user = {
                    ...account,
                    type: 'client'
                };
            } else {
                return ctx.unauthorized('Invalid token type');
            }

            await next();
        } catch (error) {
            console.error('Authentication middleware error:', error);
            return ctx.unauthorized('Invalid token');
        }
    };
};

