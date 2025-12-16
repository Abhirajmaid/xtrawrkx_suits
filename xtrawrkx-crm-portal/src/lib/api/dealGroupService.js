import strapiClient from '../strapiClient';

class DealGroupService {
    /**
     * Get all deal groups
     */
    async getAll(params = {}) {
        try {
            const response = await strapiClient.getDealGroups(params);
            
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
            console.error('Error fetching deal groups:', error);
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
     * Get a single deal group by ID
     */
    async getById(id, params = {}) {
        try {
            const response = await strapiClient.getDealGroup(id, params);
            
            if (response?.data) {
                return { data: response.data };
            } else if (response?.id) {
                return { data: response };
            } else {
                return { data: null };
            }
        } catch (error) {
            console.error(`Error fetching deal group ${id}:`, error);
            return { data: null };
        }
    }

    /**
     * Create a new deal group
     */
    async create(data) {
        try {
            const response = await strapiClient.createDealGroup(data);
            
            if (response.data) {
                return response.data;
            }

            return response;
        } catch (error) {
            console.error('Error creating deal group:', error);
            throw error;
        }
    }

    /**
     * Update a deal group
     */
    async update(id, data) {
        try {
            const response = await strapiClient.updateDealGroup(id, data);
            return response.data;
        } catch (error) {
            console.error(`Error updating deal group ${id}:`, error);
            throw error;
        }
    }

    /**
     * Delete a deal group
     */
    async delete(id) {
        try {
            await strapiClient.deleteDealGroup(id);
            return true;
        } catch (error) {
            console.error(`Error deleting deal group ${id}:`, error);
            throw error;
        }
    }
}

export default new DealGroupService();


