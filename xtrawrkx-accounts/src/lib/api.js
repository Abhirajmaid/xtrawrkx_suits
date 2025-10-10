// API base URL
const API_BASE_URL = 'http://localhost:3004';

// Helper function to get auth token
const getAuthToken = () => {
    return localStorage.getItem('authToken');
};

// Helper function to make API requests
const apiRequest = async (endpoint, options = {}) => {
    const token = getAuthToken();

    const config = {
        headers: {
            'Content-Type': 'application/json',
            ...(token && { 'Authorization': `Bearer ${token}` }),
            ...options.headers,
        },
        ...options,
    };

    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);

    if (!response.ok) {
        const error = await response.json().catch(() => ({ error: 'Network error' }));
        throw new Error(error.error || `HTTP ${response.status}`);
    }

    return response.json();
};

// User Management API
export const userAPI = {
    // Get all users with optional filters
    getUsers: async (params = {}) => {
        const searchParams = new URLSearchParams();

        if (params.search) searchParams.append('search', params.search);
        if (params.role && params.role !== 'all') searchParams.append('role', params.role);
        if (params.department && params.department !== 'all') searchParams.append('department', params.department);
        if (params.page) searchParams.append('page', params.page.toString());
        if (params.limit) searchParams.append('limit', params.limit.toString());

        const queryString = searchParams.toString();
        const endpoint = `/api/users${queryString ? `?${queryString}` : ''}`;

        return apiRequest(endpoint);
    },

    // Get single user by ID
    getUser: async (id) => {
        return apiRequest(`/api/users/${id}`);
    },

    // Create new user
    createUser: async (userData) => {
        return apiRequest('/api/users', {
            method: 'POST',
            body: JSON.stringify(userData),
        });
    },

    // Update user
    updateUser: async (id, userData) => {
        return apiRequest(`/api/users/${id}`, {
            method: 'PUT',
            body: JSON.stringify(userData),
        });
    },

    // Delete user (soft delete)
    deleteUser: async (id) => {
        return apiRequest(`/api/users/${id}`, {
            method: 'DELETE',
        });
    },
};

// Role and Department constants
export const ROLES = [
    { value: 'ADMIN', label: 'Admin' },
    { value: 'PROJECT_MANAGER', label: 'Project Manager' },
    { value: 'SALES_MANAGER', label: 'Sales Manager' },
    { value: 'SALES_REP', label: 'Sales Rep' },
    { value: 'DEVELOPER', label: 'Developer' },
    { value: 'DESIGNER', label: 'Designer' },
];

export const DEPARTMENTS = [
    { value: 'MANAGEMENT', label: 'Management' },
    { value: 'SALES', label: 'Sales' },
    { value: 'DELIVERY', label: 'Delivery' },
    { value: 'DEVELOPMENT', label: 'Development' },
    { value: 'DESIGN', label: 'Design' },
];

// Helper functions
export const getRoleBadgeColor = (role) => {
    const colors = {
        ADMIN: "bg-red-100 text-red-800 border-red-200",
        PROJECT_MANAGER: "bg-purple-100 text-purple-800 border-purple-200",
        SALES_MANAGER: "bg-blue-100 text-blue-800 border-blue-200",
        SALES_REP: "bg-green-100 text-green-800 border-green-200",
        DEVELOPER: "bg-orange-100 text-orange-800 border-orange-200",
        DESIGNER: "bg-pink-100 text-pink-800 border-pink-200",
    };
    return colors[role] || "bg-gray-100 text-gray-800 border-gray-200";
};

export const getRoleLabel = (role) => {
    const labels = {
        ADMIN: "Admin",
        PROJECT_MANAGER: "Project Manager",
        SALES_MANAGER: "Sales Manager",
        SALES_REP: "Sales Rep",
        DEVELOPER: "Developer",
        DESIGNER: "Designer",
    };
    return labels[role] || role;
};

export const getDepartmentLabel = (department) => {
    const labels = {
        MANAGEMENT: "Management",
        SALES: "Sales",
        DELIVERY: "Delivery",
        DEVELOPMENT: "Development",
        DESIGN: "Design",
    };
    return labels[department] || department;
};

