'use strict';

/**
 * Role-based access control middleware
 */
module.exports = (requiredRoles = [], options = {}) => {
    return async (ctx, next) => {
        const user = ctx.state.user;

        if (!user) {
            return ctx.unauthorized('Authentication required');
        }

        // Internal users have role-based access
        if (user.type === 'internal') {
            const userRole = user.role;
            const userDepartment = user.department;

            // Check if user has required role
            if (requiredRoles.length > 0 && !requiredRoles.includes(userRole)) {
                return ctx.forbidden(`Access denied. Required roles: ${requiredRoles.join(', ')}`);
            }

            // Admin users have access to everything
            if (userRole === 'ADMIN') {
                return await next();
            }

            // Department-specific access
            if (options.department && userDepartment !== options.department) {
                return ctx.forbidden(`Access denied. Required department: ${options.department}`);
            }

            // Resource ownership check
            if (options.checkOwnership && ctx.params.id) {
                const resourceId = ctx.params.id;
                const resourceType = options.resourceType;

                if (resourceType) {
                    try {
                        const resource = await strapi.db.query(resourceType).findOne({
                            where: { id: resourceId },
                            populate: { owner: true, assignedTo: true, createdBy: true }
                        });

                        if (!resource) {
                            return ctx.notFound('Resource not found');
                        }

                        // Check if user owns or is assigned to the resource
                        const isOwner = resource.owner?.id === user.id;
                        const isAssigned = resource.assignedTo?.id === user.id;
                        const isCreator = resource.createdBy?.id === user.id;

                        if (!isOwner && !isAssigned && !isCreator) {
                            return ctx.forbidden('Access denied. You do not have permission to access this resource');
                        }
                    } catch (error) {
                        console.error('Ownership check error:', error);
                        return ctx.internalServerError('Failed to verify resource ownership');
                    }
                }
            }
        }

        // Client accounts have limited access
        else if (user.type === 'client') {
            // Clients can only access their own data
            if (options.clientOnly !== false) {
                // Add account filter to query if not already present
                if (ctx.query && !ctx.query.filters) {
                    ctx.query.filters = {};
                }
                if (ctx.query && ctx.query.filters && !ctx.query.filters.account) {
                    ctx.query.filters.account = { $eq: user.id };
                }
            }

            // Check client-specific permissions
            if (options.clientPermissions) {
                const requiredPermissions = Array.isArray(options.clientPermissions)
                    ? options.clientPermissions
                    : [options.clientPermissions];

                // For now, all authenticated clients have basic access
                // This can be extended based on contact roles and access levels
            }
        }

        await next();
    };
};



