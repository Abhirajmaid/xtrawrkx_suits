import strapiClient from '../strapiClient';

class ProposalService {
    /**
     * Get all proposals with filtering and pagination
     */
    async getAll(params = {}) {
        try {
            const response = await strapiClient.getProposals(params);

            // Handle both array and object responses from Strapi
            if (Array.isArray(response)) {
                return {
                    data: response,
                    meta: {
                        pagination: {
                            total: response.length,
                            page: 1,
                            pageSize: response.length,
                            pageCount: 1
                        }
                    }
                };
            }

            return response;
        } catch (error) {
            console.error('Error fetching proposals:', error);
            return {
                data: [],
                meta: {
                    pagination: {
                        total: 0,
                        page: 1,
                        pageSize: 0,
                        pageCount: 0
                    }
                }
            };
        }
    }

    /**
     * Get a single proposal by ID
     */
    async getById(id, params = {}) {
        try {
            const response = await strapiClient.getProposal(id, params);
            
            if (response?.data) {
                return { data: response.data };
            } else if (response?.id) {
                return { data: response };
            } else {
                return { data: null };
            }
        } catch (error) {
            console.error(`Error fetching proposal ${id}:`, error);
            return { data: null };
        }
    }

    /**
     * Create a new proposal
     */
    async create(data) {
        try {
            const response = await strapiClient.createProposal(data);

            if (response.data) {
                return response.data;
            }

            return response;
        } catch (error) {
            console.error('Error creating proposal:', error);
            throw error;
        }
    }

    /**
     * Update a proposal
     */
    async update(id, data) {
        try {
            const response = await strapiClient.updateProposal(id, data);
            return response.data || response;
        } catch (error) {
            console.error(`Error updating proposal ${id}:`, error);
            throw error;
        }
    }

    /**
     * Delete a proposal
     */
    async delete(id) {
        try {
            await strapiClient.deleteProposal(id);
            return true;
        } catch (error) {
            console.error(`Error deleting proposal ${id}:`, error);
            throw error;
        }
    }

    /**
     * Get proposals for a client account
     */
    async getByClientAccount(clientAccountId, params = {}) {
        try {
            const queryParams = {
                'filters[clientAccount][id][$eq]': clientAccountId,
                populate: ['clientAccount', 'deal', 'contact', 'sentToContact', 'createdBy'],
                ...params
            };

            const response = await strapiClient.getProposals(queryParams);
            return response;
        } catch (error) {
            console.error(`Error fetching proposals for client account ${clientAccountId}:`, error);
            return {
                data: [],
                meta: {
                    pagination: {
                        total: 0,
                        page: 1,
                        pageSize: 0,
                        pageCount: 0
                    }
                }
            };
        }
    }

    /**
     * Get proposals by status
     */
    async getByStatus(status, params = {}) {
        try {
            const queryParams = {
                'filters[status][$eq]': status,
                populate: ['clientAccount', 'deal', 'createdBy'],
                ...params
            };

            const response = await strapiClient.getProposals(queryParams);
            return response;
        } catch (error) {
            console.error(`Error fetching proposals by status ${status}:`, error);
            throw error;
        }
    }
}

export default new ProposalService();

