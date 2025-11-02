import strapiClient from '../strapiClient';

class InvoiceService {
    /**
     * Get all invoices with filtering and pagination
     */
    async getAll(params = {}) {
        try {
            const response = await strapiClient.getInvoices(params);

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
            console.error('Error fetching invoices:', error);
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
     * Get a single invoice by ID
     */
    async getById(id, params = {}) {
        try {
            const response = await strapiClient.getInvoice(id, params);
            
            if (response?.data) {
                return { data: response.data };
            } else if (response?.id) {
                return { data: response };
            } else {
                return { data: null };
            }
        } catch (error) {
            console.error(`Error fetching invoice ${id}:`, error);
            return { data: null };
        }
    }

    /**
     * Create a new invoice
     */
    async create(data) {
        try {
            const response = await strapiClient.createInvoice(data);

            if (response.data) {
                return response.data;
            }

            return response;
        } catch (error) {
            console.error('Error creating invoice:', error);
            throw error;
        }
    }

    /**
     * Update an invoice
     */
    async update(id, data) {
        try {
            const response = await strapiClient.updateInvoice(id, data);
            return response.data || response;
        } catch (error) {
            console.error(`Error updating invoice ${id}:`, error);
            throw error;
        }
    }

    /**
     * Delete an invoice
     */
    async delete(id) {
        try {
            await strapiClient.deleteInvoice(id);
            return true;
        } catch (error) {
            console.error(`Error deleting invoice ${id}:`, error);
            throw error;
        }
    }

    /**
     * Get invoices for a client account
     */
    async getByClientAccount(clientAccountId, params = {}) {
        try {
            const queryParams = {
                'filters[clientAccount][id][$eq]': clientAccountId,
                populate: ['clientAccount', 'createdBy', 'files', 'items'],
                ...params
            };

            const response = await strapiClient.getInvoices(queryParams);
            return response;
        } catch (error) {
            console.error(`Error fetching invoices for client account ${clientAccountId}:`, error);
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
     * Get invoices by status
     */
    async getByStatus(status, params = {}) {
        try {
            const queryParams = {
                'filters[status][$eq]': status,
                populate: ['account', 'createdBy'],
                ...params
            };

            const response = await strapiClient.getInvoices(queryParams);
            return response;
        } catch (error) {
            console.error(`Error fetching invoices by status ${status}:`, error);
            throw error;
        }
    }

    /**
     * Upload invoice document
     */
    async uploadDocument(invoiceId, file) {
        try {
            const formData = new FormData();
            formData.append('files', file);
            formData.append('refId', invoiceId);
            formData.append('ref', 'api::invoice.invoice');
            formData.append('field', 'files');

            const response = await fetch(`${strapiClient.baseURL}/api/upload`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${strapiClient.getToken()}`
                },
                body: formData
            });

            if (!response.ok) {
                throw new Error('Failed to upload file');
            }

            return await response.json();
        } catch (error) {
            console.error('Error uploading invoice document:', error);
            throw error;
        }
    }
}

export default new InvoiceService();

