'use strict';

/**
 * project controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::project.project', ({ strapi }) => {
    /**
     * Helper function to find or create account from client account
     */
    const findOrCreateAccountFromClientAccount = async (clientAccountId) => {
        try {
            // First, get the client account
            const clientAccount = await strapi.entityService.findOne('api::client-account.client-account', clientAccountId);

            if (!clientAccount) {
                console.log('Client account not found:', clientAccountId);
                return null;
            }

            // Try to find an existing account with the same company name
            const existingAccounts = await strapi.entityService.findMany('api::account.account', {
                filters: {
                    companyName: {
                        $eq: clientAccount.companyName
                    }
                },
                limit: 1
            });

            if (existingAccounts && existingAccounts.length > 0) {
                console.log('Found existing account for client account:', existingAccounts[0].id);
                return existingAccounts[0].id;
            }

            // Create a new account from the client account data
            const newAccount = await strapi.entityService.create('api::account.account', {
                data: {
                    companyName: clientAccount.companyName,
                    industry: clientAccount.industry || '',
                    website: clientAccount.website || null,
                    phone: clientAccount.phone || null,
                    email: clientAccount.email || null,
                    address: clientAccount.address || null,
                    city: clientAccount.city || null,
                    state: clientAccount.state || null,
                    country: clientAccount.country || null,
                    zipCode: clientAccount.zipCode || null,
                    employees: clientAccount.employees || null,
                    type: 'CUSTOMER'
                }
            });

            console.log('Created new account from client account:', newAccount.id);
            return newAccount.id;
        } catch (error) {
            console.error('Error finding/creating account from client account:', error);
            return null;
        }
    };

    return {
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
                        deal: true,
                        clientAccount: true
                    };
                }

                // Always ensure clientAccount is populated
                populate.clientAccount = true;

                console.log('Project find - populate object:', JSON.stringify(populate, null, 2));

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

                // Debug: Log first project's clientAccount
                if (projectsData.length > 0) {
                    const firstProject = projectsData[0];
                    const projectData = firstProject.attributes || firstProject;
                    console.log('First project name:', projectData.name);
                    console.log('First project clientAccount:', projectData.clientAccount);
                    console.log('First project full (first 500 chars):', JSON.stringify(firstProject).substring(0, 500));
                }

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

                    // Build populate object with support for nested fields (e.g., "tasks.assignee")
                    populateFields.forEach(field => {
                        const trimmedField = field.trim();
                        if (trimmedField) {
                            // Handle nested populate (e.g., "tasks.assignee", "tasks.collaborators")
                            if (trimmedField.includes('.')) {
                                const parts = trimmedField.split('.');
                                const parentField = parts[0];
                                const childField = parts.slice(1).join('.'); // Handle multiple levels

                                // Initialize parent field if needed
                                if (!populate[parentField]) {
                                    populate[parentField] = { populate: {} };
                                }

                                // Convert boolean true to object with populate
                                if (populate[parentField] === true) {
                                    populate[parentField] = { populate: {} };
                                }

                                // Ensure populate object exists
                                if (typeof populate[parentField] === 'object' && !populate[parentField].populate) {
                                    populate[parentField] = { populate: {} };
                                }

                                // Set nested field using Strapi v4 syntax
                                if (populate[parentField].populate) {
                                    populate[parentField].populate[childField] = true;
                                }
                            } else {
                                // Top-level field - only set if not already an object
                                if (!populate[trimmedField] || populate[trimmedField] === true) {
                                    populate[trimmedField] = true;
                                }
                            }
                        }
                    });
                } else {
                    // Default populate with nested relations
                    populate = {
                        projectManager: true,
                        account: true,
                        deal: true,
                        tasks: {
                            populate: {
                                assignee: true,
                                collaborators: true
                            }
                        }
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

                // Handle clientAccount field - set it directly if provided
                if (data.clientAccount) {
                    console.log('Setting clientAccount field:', data.clientAccount);
                    // clientAccount is already the correct ID, just ensure it's valid
                    try {
                        const clientAccount = await strapi.entityService.findOne('api::client-account.client-account', data.clientAccount);
                        if (!clientAccount) {
                            console.log('Client account not found, removing clientAccount field');
                            delete data.clientAccount;
                        }
                    } catch (error) {
                        console.log('Error validating client account:', error);
                        delete data.clientAccount;
                    }
                }

                // Handle account field - check if it's a client account ID
                if (data.account) {
                    // Check if this ID belongs to a client account
                    try {
                        const clientAccount = await strapi.entityService.findOne('api::client-account.client-account', data.account);
                        if (clientAccount) {
                            // It's a client account, find or create the corresponding account
                            console.log('Account ID is a client account, converting...');
                            const accountId = await findOrCreateAccountFromClientAccount(data.account);
                            if (accountId) {
                                data.account = accountId;
                            } else {
                                // If we can't create/find account, remove the account field
                                delete data.account;
                            }
                        }
                    } catch (error) {
                        // If it's not a client account, it might be a regular account - proceed as normal
                        console.log('Account ID is not a client account, using as-is');
                    }
                }

                const entity = await strapi.entityService.create('api::project.project', {
                    data,
                    populate: {
                        projectManager: true,
                        account: true,
                        deal: true,
                        clientAccount: true
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

                // Handle account field - check if it's a client account ID
                if (data.account !== undefined && data.account !== null) {
                    console.log('Processing account field:', data.account, typeof data.account);

                    // Convert to number if it's a string
                    const accountIdToCheck = typeof data.account === 'string' ? parseInt(data.account, 10) : data.account;

                    if (isNaN(accountIdToCheck)) {
                        console.log('Invalid account ID, setting to null');
                        data.account = null;
                    } else {
                        // First, try to find it as a client account
                        let isClientAccount = false;
                        try {
                            const clientAccount = await strapi.entityService.findOne('api::client-account.client-account', accountIdToCheck);
                            if (clientAccount) {
                                isClientAccount = true;
                                console.log('Account ID is a client account, converting...', clientAccount.companyName || clientAccount.id);
                                const accountId = await findOrCreateAccountFromClientAccount(accountIdToCheck);
                                if (accountId) {
                                    console.log('Successfully converted client account to account ID:', accountId);
                                    data.account = accountId;
                                } else {
                                    console.log('Failed to convert client account, setting account to null');
                                    data.account = null;
                                }
                            }
                        } catch (clientAccountError) {
                            // Not a client account or error finding it
                            console.log('Not a client account (or error finding it):', clientAccountError.message);
                        }

                        // If it's not a client account, verify it's a valid regular account
                        if (!isClientAccount) {
                            try {
                                const regularAccount = await strapi.entityService.findOne('api::account.account', accountIdToCheck);
                                if (regularAccount) {
                                    console.log('It\'s a valid regular account, using as-is');
                                    data.account = accountIdToCheck;
                                } else {
                                    console.log('Account ID not found in accounts, setting to null');
                                    data.account = null;
                                }
                            } catch (accountError) {
                                console.log('Error checking regular account:', accountError.message);
                                // If we can't verify, try to use the ID as-is (might work)
                                console.log('Using account ID as-is (unverified)');
                                data.account = accountIdToCheck;
                            }
                        }
                    }
                } else {
                    console.log('Account field is null or undefined, setting to null');
                    data.account = null;
                }

                // Handle clientAccount field - set it directly if provided
                if (data.clientAccount !== undefined) {
                    if (data.clientAccount) {
                        console.log('Setting clientAccount field:', data.clientAccount);
                        // Validate client account exists
                        try {
                            const clientAccount = await strapi.entityService.findOne('api::client-account.client-account', data.clientAccount);
                            if (!clientAccount) {
                                console.log('Client account not found, setting to null');
                                data.clientAccount = null;
                            }
                        } catch (error) {
                            console.log('Error validating client account:', error);
                            data.clientAccount = null;
                        }
                    } else {
                        data.clientAccount = null;
                    }
                }

                console.log('Updating project with final data:', JSON.stringify(data, null, 2));

                // Update the project using entityService
                const entity = await strapi.entityService.update('api::project.project', id, {
                    data,
                    populate: {
                        projectManager: true,
                        account: true,
                        deal: true,
                        teamMembers: true,
                        clientAccount: true
                    }
                });

                console.log('Updated project clientAccount:', entity?.clientAccount || entity?.attributes?.clientAccount);

                console.log('Updated project:', entity);

                return { data: entity };
            } catch (error) {
                console.error(`Project update error for ID ${ctx.params.id}:`, error);
                console.error('Error details:', error.message);
                console.error('Error stack:', error.stack);
                return ctx.badRequest(`Failed to update project: ${error.message}`);
            }
        },

        /**
         * Delete a project with cascade deletion of related data
         */
        async delete(ctx) {
            try {
                const { id } = ctx.params;
                console.log(`Deleting project ${id} with cascade deletion`);

                // First, get the project with all relations
                const project = await strapi.entityService.findOne('api::project.project', id, {
                    populate: {
                        tasks: true,
                        activities: true,
                        timeEntries: true,
                        files: true,
                        teamMembers: true
                    }
                });

                if (!project) {
                    return ctx.notFound('Project not found');
                }

                // Delete all related tasks (and their subtasks and comments)
                if (project.tasks && project.tasks.length > 0) {
                    console.log(`Processing ${project.tasks.length} related tasks`);
                    for (const task of project.tasks) {
                        try {
                            // Get task with all projects to check if it belongs to other projects
                            const fullTask = await strapi.entityService.findOne('api::task.task', task.id, {
                                populate: {
                                    subtasks: true,
                                    projects: true
                                }
                            });

                            // Check if task belongs to other projects
                            const belongsToOtherProjects = fullTask && fullTask.projects &&
                                fullTask.projects.some(p => p.id !== parseInt(id));

                            if (belongsToOtherProjects) {
                                console.log(`Task ${task.id} belongs to other projects, unlinking from this project only`);
                                // Just unlink the task from this project, don't delete it
                                const currentProjects = fullTask.projects
                                    .filter(p => p.id !== parseInt(id))
                                    .map(p => p.id);

                                await strapi.entityService.update('api::task.task', task.id, {
                                    data: {
                                        projects: currentProjects
                                    }
                                });
                                continue; // Skip deletion, move to next task
                            }

                            console.log(`Deleting task ${task.id} (only belongs to this project)`);

                            // Delete all task comments first (comments are linked by commentableId and commentableType)
                            try {
                                const taskComments = await strapi.entityService.findMany('api::task-comment.task-comment', {
                                    filters: {
                                        commentableId: { $eq: String(task.id) },
                                        commentableType: { $eq: 'TASK' }
                                    }
                                });

                                if (taskComments && taskComments.length > 0) {
                                    console.log(`Deleting ${taskComments.length} comments for task ${task.id}`);
                                    for (const comment of taskComments) {
                                        try {
                                            // Delete comment replies first (recursive)
                                            const replies = await strapi.entityService.findMany('api::task-comment.task-comment', {
                                                filters: {
                                                    parentComment: { id: { $eq: comment.id } }
                                                }
                                            });

                                            for (const reply of replies) {
                                                try {
                                                    await strapi.entityService.delete('api::task-comment.task-comment', reply.id);
                                                } catch (replyError) {
                                                    console.error(`Error deleting comment reply ${reply.id}:`, replyError.message);
                                                }
                                            }

                                            // Delete the comment itself
                                            await strapi.entityService.delete('api::task-comment.task-comment', comment.id);
                                        } catch (commentError) {
                                            console.error(`Error deleting comment ${comment.id}:`, commentError.message);
                                        }
                                    }
                                }
                            } catch (commentError) {
                                console.error(`Error fetching/deleting comments for task ${task.id}:`, commentError.message);
                            }

                            // Delete all subtasks first (and their comments)
                            if (fullTask && fullTask.subtasks && fullTask.subtasks.length > 0) {
                                console.log(`Deleting ${fullTask.subtasks.length} subtasks for task ${task.id}`);
                                for (const subtask of fullTask.subtasks) {
                                    try {
                                        // Delete subtask comments
                                        try {
                                            const subtaskComments = await strapi.entityService.findMany('api::task-comment.task-comment', {
                                                filters: {
                                                    commentableId: { $eq: String(subtask.id) },
                                                    commentableType: { $eq: 'SUBTASK' }
                                                }
                                            });

                                            for (const comment of subtaskComments) {
                                                try {
                                                    // Delete replies first
                                                    const replies = await strapi.entityService.findMany('api::task-comment.task-comment', {
                                                        filters: {
                                                            parentComment: { id: { $eq: comment.id } }
                                                        }
                                                    });

                                                    for (const reply of replies) {
                                                        await strapi.entityService.delete('api::task-comment.task-comment', reply.id);
                                                    }

                                                    await strapi.entityService.delete('api::task-comment.task-comment', comment.id);
                                                } catch (commentError) {
                                                    console.error(`Error deleting subtask comment:`, commentError.message);
                                                }
                                            }
                                        } catch (commentError) {
                                            console.error(`Error fetching subtask comments:`, commentError.message);
                                        }

                                        await strapi.entityService.delete('api::subtask.subtask', subtask.id);
                                        console.log(`Deleted subtask ${subtask.id}`);
                                    } catch (subtaskError) {
                                        console.error(`Error deleting subtask ${subtask.id}:`, subtaskError.message);
                                    }
                                }
                            }

                            // Delete the task itself
                            await strapi.entityService.delete('api::task.task', task.id);
                            console.log(`Deleted task ${task.id}`);
                        } catch (taskError) {
                            console.error(`Error deleting task ${task.id}:`, taskError.message);
                            // Continue with other deletions even if one fails
                        }
                    }
                }

                // Delete all related activities
                if (project.activities && project.activities.length > 0) {
                    console.log(`Deleting ${project.activities.length} related activities`);
                    for (const activity of project.activities) {
                        try {
                            await strapi.entityService.delete('api::activity.activity', activity.id);
                            console.log(`Deleted activity ${activity.id}`);
                        } catch (activityError) {
                            console.error(`Error deleting activity ${activity.id}:`, activityError.message);
                        }
                    }
                }

                // Delete all related time entries
                if (project.timeEntries && project.timeEntries.length > 0) {
                    console.log(`Deleting ${project.timeEntries.length} related time entries`);
                    for (const timeEntry of project.timeEntries) {
                        try {
                            await strapi.entityService.delete('api::time-entry.time-entry', timeEntry.id);
                            console.log(`Deleted time entry ${timeEntry.id}`);
                        } catch (timeEntryError) {
                            console.error(`Error deleting time entry ${timeEntry.id}:`, timeEntryError.message);
                        }
                    }
                }

                // Delete all related files
                if (project.files && project.files.length > 0) {
                    console.log(`Deleting ${project.files.length} related files`);
                    for (const file of project.files) {
                        try {
                            await strapi.entityService.delete('api::file.file', file.id);
                            console.log(`Deleted file ${file.id}`);
                        } catch (fileError) {
                            console.error(`Error deleting file ${file.id}:`, fileError.message);
                        }
                    }
                }

                // Delete the project itself
                const deletedProject = await strapi.entityService.delete('api::project.project', id);

                console.log(`Project ${id} deleted successfully`);

                return { data: deletedProject };
            } catch (error) {
                console.error('Error deleting project:', error);
                console.error('Error details:', error.message);
                console.error('Error stack:', error.stack);
                return ctx.badRequest(`Failed to delete project: ${error.message}`);
            }
        },
    };
});

