/**
 * Permissions Service
 * Handles role hierarchy and permission checks for hierarchical access control
 */

class PermissionsService {
    /**
     * Role hierarchy levels (higher number = higher authority)
     * Must match the backend hierarchy in user-role service
     */
    static getRoleHierarchy() {
        return {
            'READ_ONLY': 1,
            'Read-only User': 1,
            'DEVELOPER': 2,
            'Developer': 2,
            'SALES_REP': 5,
            'Sales Representative': 5,
            'ACCOUNT_MANAGER': 6,
            'Account Manager': 6,
            'FINANCE': 8,
            'Finance Manager': 8,
            'PROJECT_MANAGER': 9,
            'Project Manager': 9,
            'SALES_MANAGER': 10,
            'Sales Manager': 10,
            'MANAGER': 10,
            'Manager': 10,
            'ADMIN': 15,
            'Admin': 15,
            'Administrator': 15,
            'SUPER_ADMIN': 20,
            'Super Admin': 20,
            'Super Administrator': 20
        };
    }

    /**
     * Get role level for comparison
     */
    static getRoleLevel(role) {
        const hierarchy = this.getRoleHierarchy();
        return hierarchy[role] || 0;
    }

    /**
     * Check if current user can edit target user based on role hierarchy
     */
    static canEditUser(currentUserRole, targetUserRole) {
        const currentLevel = this.getRoleLevel(currentUserRole);
        const targetLevel = this.getRoleLevel(targetUserRole);

        // Users can only edit users with lower role levels
        return currentLevel > targetLevel;
    }

    /**
     * Check if current user can manage roles for target user
     */
    static canManageUserRoles(currentUserRole, targetUserRole) {
        const currentLevel = this.getRoleLevel(currentUserRole);
        const targetLevel = this.getRoleLevel(targetUserRole);

        // Users can only manage roles for users with lower role levels
        return currentLevel > targetLevel;
    }

    /**
     * Check if current user can assign a specific role
     */
    static canAssignRole(currentUserRole, roleToAssign) {
        const currentLevel = this.getRoleLevel(currentUserRole);
        const roleLevel = this.getRoleLevel(roleToAssign);

        // Users can only assign roles lower than their own level
        return currentLevel > roleLevel;
    }

    /**
     * Get available roles that current user can assign
     */
    static getAssignableRoles(currentUserRole) {
        const hierarchy = this.getRoleHierarchy();
        const currentLevel = this.getRoleLevel(currentUserRole);

        const assignableRoles = [];
        for (const [role, level] of Object.entries(hierarchy)) {
            if (level < currentLevel) {
                assignableRoles.push(role);
            }
        }

        return assignableRoles;
    }

    /**
     * Check if current user can edit primary roles
     */
    static canEditPrimaryRole(currentUserRole) {
        // Only Super Admin can edit primary roles
        return this.getRoleLevel(currentUserRole) >= 20; // Super Admin level
    }

    /**
     * Get current user role from stored user data
     */
    static getCurrentUserRole() {
        try {
            const userData = localStorage.getItem('currentUser');
            if (!userData) return null;

            const parsed = JSON.parse(userData);
            return parsed.role;
        } catch (error) {
            console.error('Error getting current user role:', error);
            return null;
        }
    }

    /**
     * Check if current user has admin access (can view user management)
     */
    static hasAdminAccess() {
        const currentRole = this.getCurrentUserRole();
        const hierarchy = this.getRoleHierarchy();

        // Must be at least Manager level to access user management
        return this.getRoleLevel(currentRole) >= 10;
    }

    /**
     * Get role badge color for UI consistency
     */
    static getRoleBadgeColor(role) {
        const colors = {
            "Super Admin": "bg-red-100 text-red-800",
            "Admin": "bg-red-100 text-red-800",
            "Manager": "bg-purple-100 text-purple-800",
            "Project Manager": "bg-blue-100 text-blue-800",
            "Sales Representative": "bg-green-100 text-green-800",
            "Developer": "bg-gray-100 text-gray-800",
            "Designer": "bg-pink-100 text-pink-800",
            // Legacy enum support
            "ADMIN": "bg-red-100 text-red-800",
            "MANAGER": "bg-purple-100 text-purple-800",
            "PROJECT_MANAGER": "bg-blue-100 text-blue-800",
            "SALES_REP": "bg-green-100 text-green-800",
            "DEVELOPER": "bg-gray-100 text-gray-800",
            "DESIGNER": "bg-pink-100 text-pink-800",
        };
        return colors[role] || "bg-gray-100 text-gray-800";
    }

    /**
     * Get role description for UI
     */
    static getRoleDescription(role) {
        const descriptions = {
            "Super Admin": "Full system access and control",
            "Admin": "Administrative access with limitations",
            "Manager": "Team management and oversight",
            "Project Manager": "Project and task management",
            "Sales Representative": "Sales and customer management",
            "Developer": "Development team member",
            "Account Manager": "Client relationship management",
            "Finance Manager": "Financial data and reporting",
            "Read-only User": "View-only access"
        };
        return descriptions[role] || "Standard user access";
    }
}

export default PermissionsService;