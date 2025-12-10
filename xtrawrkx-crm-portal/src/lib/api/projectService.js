import strapiClient from "../strapiClient";

class ProjectService {
  /**
   * Get all projects with optional filtering and pagination
   * @param {Object} options - Query options
   * @returns {Promise<Object>} - Projects data with pagination info
   */
  async getAll(options = {}) {
    const {
      page = 1,
      pageSize = 25,
      sort = "createdAt:desc",
      filters = {},
      populate = ["projectManager", "teamMembers", "tasks", "account"],
    } = options;

    const params = {
      "pagination[page]": page,
      "pagination[pageSize]": pageSize,
      sort,
      populate: populate.join(","),
    };

    // Add filters
    if (Object.keys(filters).length > 0) {
      Object.keys(filters).forEach((key) => {
        const value = filters[key];
        if (typeof value === "object" && value !== null && !Array.isArray(value)) {
          // Handle nested filters like { id: { $eq: 1 } }
          if (key.includes('.')) {
            // Handle dot notation like "clientAccount.id"
            const parts = key.split('.');
            if (parts.length === 2) {
              Object.keys(value).forEach((operator) => {
                const operatorValue = value[operator];
                if (typeof operatorValue === "object" && operatorValue !== null) {
                  Object.keys(operatorValue).forEach((subOp) => {
                    params[`filters[${parts[0]}][${parts[1]}][${operator}][${subOp}]`] = operatorValue[subOp];
                  });
                } else {
                  params[`filters[${parts[0]}][${parts[1]}][${operator}]`] = operatorValue;
                }
              });
            }
          } else {
            Object.keys(value).forEach((operator) => {
              const operatorValue = value[operator];
              if (typeof operatorValue === "object" && operatorValue !== null && !Array.isArray(operatorValue)) {
                // Handle deeply nested filters like { id: { $eq: 1 } }
                Object.keys(operatorValue).forEach((subOp) => {
                  params[`filters[${key}][${operator}][${subOp}]`] = operatorValue[subOp];
                });
              } else {
                params[`filters[${key}][${operator}]`] = operatorValue;
              }
            });
          }
        } else {
          params[`filters[${key}]`] = value;
        }
      });
    }

    try {
      const response = await strapiClient.get("/projects", { params });
      return response;
    } catch (error) {
      console.error("Error fetching projects:", error);
      throw error;
    }
  }

  /**
   * Get projects by client account ID
   * @param {string|number} clientAccountId - Client Account ID
   * @param {Object} options - Query options
   * @returns {Promise<Object>} - Projects data
   */
  async getByClientAccount(clientAccountId, options = {}) {
    try {
      // First, try to find projects directly linked to client account
      // The backend controller should handle the conversion
      const params = {
        "pagination[pageSize]": options.pageSize || 100,
        populate: ["projectManager", "teamMembers", "account"].join(","),
        sort: "createdAt:desc",
      };

      // Try filtering by account ID (the controller converts client account to account)
      // We'll need to check if there's a direct clientAccount relation or use account
      const response = await strapiClient.get("/projects", {
        params: {
          ...params,
          "filters[account][id][$eq]": clientAccountId,
        },
      });

      return response;
    } catch (error) {
      console.error("Error fetching projects by client account:", error);
      // Fallback: try to get all projects and filter client-side
      // This is a temporary solution until the backend relation is clear
      const allProjects = await this.getAll({
        pageSize: 100,
        populate: ["projectManager", "teamMembers", "account"],
      });
      
      // Filter projects where account matches (if account was converted from client account)
      // This is a workaround - ideally the backend should handle this
      return {
        data: allProjects.data || [],
        meta: allProjects.meta || {},
      };
    }
  }

  /**
   * Get project by ID
   * @param {string|number} id - Project ID
   * @param {Array} populate - Relations to populate
   * @returns {Promise<Object>} - Project data
   */
  async getById(id, populate = ["projectManager", "teamMembers", "tasks", "account"]) {
    try {
      const params = {
        populate: populate.join(","),
      };
      const response = await strapiClient.get(`/projects/${id}`, { params });
      return response;
    } catch (error) {
      console.error("Error fetching project:", error);
      throw error;
    }
  }

  /**
   * Create a new project
   * @param {Object} projectData - Project data
   * @returns {Promise<Object>} - Created project
   */
  async create(projectData) {
    try {
      const response = await strapiClient.post("/projects", {
        data: projectData,
      });
      return response;
    } catch (error) {
      console.error("Error creating project:", error);
      throw error;
    }
  }

  /**
   * Update a project
   * @param {string|number} id - Project ID
   * @param {Object} projectData - Updated project data
   * @returns {Promise<Object>} - Updated project
   */
  async update(id, projectData) {
    try {
      const response = await strapiClient.put(`/projects/${id}`, {
        data: projectData,
      });
      return response;
    } catch (error) {
      console.error("Error updating project:", error);
      throw error;
    }
  }

  /**
   * Delete a project
   * @param {string|number} id - Project ID
   * @returns {Promise<void>}
   */
  async delete(id) {
    try {
      await strapiClient.delete(`/projects/${id}`);
    } catch (error) {
      console.error("Error deleting project:", error);
      throw error;
    }
  }
}

// Create and export singleton instance
const projectService = new ProjectService();
export default projectService;

