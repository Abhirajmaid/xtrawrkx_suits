'use strict';

/**
 * project controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::project.project', ({ strapi }) => ({
    /**
     * Get all projects
     */
    async find(ctx) {
        try {
            console.log('=== find method called for projects ===');
            console.log('Request URL:', ctx.request.url);
            console.log('Request method:', ctx.request.method);
            console.log('Query object:', ctx.query);

            const { query } = ctx;

            // Parse populate from query string
            let populate = {};
            if (query.populate) {
                const populateFields = typeof query.populate === 'string'
                    ? query.populate.split(',')
                    : Array.isArray(query.populate)
                        ? query.populate
                        : [];

                // Build populate object
                populateFields.forEach(field => {
                    const trimmedField = field.trim();
                    if (trimmedField) {
                        populate[trimmedField] = true;
                    }
                });
            } else {
                // Default populate
                populate = {
                    projectManager: true,
                    account: true,
                    deal: true
                };
            }

            // Parse filters from query string
            let filters = {};
            if (query.filters) {
                try {
                    filters = typeof query.filters === 'string'
                        ? JSON.parse(query.filters)
                        : query.filters;
                } catch (e) {
                    console.warn('Error parsing filters:', e);
                    filters = {};
                }
            }

            // Parse sort - handle both string and object formats
            let sort = {};
            if (query.sort) {
                if (typeof query.sort === 'string') {
                    // Handle "createdAt:desc" format
                    const [field, order] = query.sort.split(':');
                    sort = { [field]: order || 'desc' };
                } else {
                    sort = query.sort;
                }
            } else {
                sort = { createdAt: 'desc' };
            }

            // Parse pagination
            let pagination = { page: 1, pageSize: 25 };
            if (query.pagination) {
                pagination = typeof query.pagination === 'string'
                    ? JSON.parse(query.pagination)
                    : query.pagination;
            } else {
                if (query['pagination[page]']) {
                    pagination.page = parseInt(String(query['pagination[page]'])) || 1;
                }
                if (query['pagination[pageSize]']) {
                    pagination.pageSize = parseInt(String(query['pagination[pageSize]'])) || 25;
                }
            }

            console.log('Query parameters:', { filters, sort, pagination, populate });

            // Fetch projects using entityService
            const projects = await strapi.entityService.findPage('api::project.project', {
                filters,
                populate,
                sort,
                pagination
            });

            console.log('Projects fetched from database:', projects);

            // Handle both 'data' and 'results' properties (Strapi might use either)
            let projectsData = [];
            let projectsMeta = null;

            if (projects) {
                // Check for 'data' property
                if ('data' in projects && Array.isArray(projects.data)) {
                    projectsData = projects.data;
                    projectsMeta = ('meta' in projects) ? projects.meta : null;
                }
                // Check for 'results' property (some Strapi versions use this)
                else if ('results' in projects && Array.isArray(projects.results)) {
                    projectsData = projects.results;
                    projectsMeta = ('meta' in projects) ? projects.meta :
                        ('pagination' in projects) ? projects.pagination : null;
                }
                // Fallback: if projects is directly an array
                else if (Array.isArray(projects)) {
                    projectsData = projects;
                }
            }

            console.log('Number of projects:', projectsData.length);
            console.log('Projects data structure:', {
                hasData: projectsData.length > 0,
                dataLength: projectsData.length,
                hasMeta: !!projectsMeta
            });

            // Ensure we return a proper format even if empty
            if (!projectsData || projectsData.length === 0) {
                return ctx.send({
                    data: [],
                    meta: {
                        pagination: {
                            page: pagination.page || 1,
                            pageSize: pagination.pageSize || 25,
                            pageCount: 0,
                            total: 0
                        }
                    }
                });
            }

            // Return in the standard Strapi format that frontend expects
            return ctx.send({
                data: projectsData,
                meta: projectsMeta || {
                    pagination: {
                        page: pagination.page || 1,
                        pageSize: pagination.pageSize || 25,
                        pageCount: Math.ceil(projectsData.length / (pagination.pageSize || 25)),
                        total: projectsData.length
                    }
                }
            });
        } catch (error) {
            console.error('Error fetching projects:', error);
            return ctx.badRequest(`Failed to fetch projects: ${error.message}`);
        }
    },

    /**
     * Get a single project by ID
     */
    async findOne(ctx) {
        try {
            const { id } = ctx.params;
            console.log('Fetching project by ID:', id);

            const { query } = ctx;

            // Parse populate from query string
            let populate = {};
            if (query.populate) {
                const populateFields = typeof query.populate === 'string'
                    ? query.populate.split(',')
                    : Array.isArray(query.populate)
                        ? query.populate
                        : [];

                // Build populate object
                populateFields.forEach(field => {
                    const trimmedField = field.trim();
                    if (trimmedField) {
                        populate[trimmedField] = true;
                    }
                });
            } else {
                // Default populate
                populate = {
                    projectManager: true,
                    account: true,
                    deal: true
                };
            }

            const project = await strapi.entityService.findOne('api::project.project', id, {
                populate
            });

            if (!project) {
                return ctx.notFound('Project not found');
            }

            return { data: project };
        } catch (error) {
            console.error('Error fetching project:', error);
            return ctx.badRequest(`Failed to fetch project: ${error.message}`);
        }
    },

    /**
     * Create a new project
     */
    async create(ctx) {
        try {
            console.log('Creating project with data:', ctx.request.body);
            const { data } = ctx.request.body;

            if (!data) {
                console.log('No data provided in request body');
                return ctx.badRequest('No data provided');
            }

            const entity = await strapi.entityService.create('api::project.project', {
                data,
                populate: {
                    projectManager: true,
                    account: true,
                    deal: true
                }
            });

            console.log('Created project:', entity);

            return { data: entity };
        } catch (error) {
            console.error('Project creation error:', error);
            console.error('Error details:', error.message);
            return ctx.badRequest(`Failed to create project: ${error.message}`);
        }
    },

    /**
     * Update a project
     */
    async update(ctx) {
        try {
            const { id } = ctx.params;
            const { data } = ctx.request.body;

            console.log(`Updating project ${id} with data:`, data);

            // Ensure teamMembers IDs are integers if present
            if (data.teamMembers !== undefined && Array.isArray(data.teamMembers)) {
                data.teamMembers = data.teamMembers
                    .map(memberId => {
                        if (typeof memberId === 'string') {
                            return parseInt(memberId, 10);
                        }
                        return memberId;
                    })
                    .filter(memberId => !isNaN(memberId));
            }

            // Update the project using entityService
            const entity = await strapi.entityService.update('api::project.project', id, {
                data,
                populate: {
                    projectManager: true,
                    account: true,
                    deal: true,
                    teamMembers: true
                }
            });

            console.log('Updated project:', entity);

            return { data: entity };
        } catch (error) {
            console.error(`Project update error for ID ${ctx.params.id}:`, error);
            console.error('Error details:', error.message);
            console.error('Error stack:', error.stack);
            return ctx.badRequest(`Failed to update project: ${error.message}`);
        }
    },
}));

