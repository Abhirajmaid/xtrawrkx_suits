/**
 * Script to add missing roles to the Strapi database
 * Run this script from the project root: node add-missing-roles.js
 */

const STRAPI_URL = 'http://localhost:1337';
const API_URL = `${STRAPI_URL}/api`;

// Missing roles to add
const missingRoles = [
    {
        name: 'Sales Manager',
        description: 'Manages sales team, leads, and revenue tracking',
        isSystemRole: true,
        rank: 10,
        color: 'from-green-500 to-green-600',
        icon: 'Target',
        visibility: 'team',
        permissions: {
            leads: { create: true, read: true, update: true, delete: false, convert: true },
            accounts: { create: true, read: true, update: true, delete: false },
            contacts: { create: true, read: true, update: true, delete: false },
            deals: { create: true, read: true, update: true, delete: false },
            projects: { create: true, read: true, update: true, delete: false },
            tasks: { create: true, read: true, update: true, delete: false },
            reports: { create: true, read: true, update: true, delete: false },
            imports: { create: true, read: true, update: false, delete: false, import: true },
            exports: { create: false, read: true, update: false, delete: false, export: true },
            users: { create: true, read: true, update: true, delete: false },
            roles: { create: false, read: true, update: false, delete: false },
            settings: { create: false, read: true, update: true, delete: false },
            profile: { read: true, update: true, changePassword: true }
        }
    },
    {
        name: 'Finance Manager',
        description: 'Manages financial data, reporting, and budgets',
        isSystemRole: true,
        rank: 8,
        color: 'from-green-500 to-green-600',
        icon: 'DollarSign',
        visibility: 'team',
        permissions: {
            leads: { create: false, read: true, update: false, delete: false, convert: false },
            accounts: { create: false, read: true, update: true, delete: false },
            contacts: { create: false, read: true, update: false, delete: false },
            deals: { create: false, read: true, update: true, delete: false },
            projects: { create: false, read: true, update: false, delete: false },
            tasks: { create: false, read: true, update: false, delete: false },
            reports: { create: true, read: true, update: true, delete: false },
            imports: { create: true, read: true, update: false, delete: false, import: true },
            exports: { create: false, read: true, update: false, delete: false, export: true },
            users: { create: false, read: true, update: false, delete: false },
            roles: { create: false, read: true, update: false, delete: false },
            settings: { create: false, read: true, update: true, delete: false },
            profile: { read: true, update: true, changePassword: true }
        }
    },
    {
        name: 'Account Manager',
        description: 'Manages client relationships and accounts',
        isSystemRole: true,
        rank: 6,
        color: 'from-indigo-500 to-indigo-600',
        icon: 'Building',
        visibility: 'private',
        permissions: {
            leads: { create: true, read: true, update: true, delete: false, convert: true },
            accounts: { create: true, read: true, update: true, delete: false },
            contacts: { create: true, read: true, update: true, delete: false },
            deals: { create: true, read: true, update: true, delete: false },
            projects: { create: false, read: true, update: false, delete: false },
            tasks: { create: false, read: true, update: true, delete: false },
            reports: { create: false, read: true, update: false, delete: false },
            imports: { create: false, read: true, update: false, delete: false, import: true },
            exports: { create: false, read: true, update: false, delete: false, export: true },
            users: { create: false, read: true, update: false, delete: false },
            roles: { create: false, read: false, update: false, delete: false },
            settings: { create: false, read: false, update: false, delete: false },
            profile: { read: true, update: true, changePassword: true }
        }
    },
    {
        name: 'Read-only User',
        description: 'View-only access to system data',
        isSystemRole: true,
        rank: 1,
        color: 'from-gray-500 to-gray-600',
        icon: 'Eye',
        visibility: 'private',
        permissions: {
            leads: { create: false, read: true, update: false, delete: false, convert: false },
            accounts: { create: false, read: true, update: false, delete: false },
            contacts: { create: false, read: true, update: false, delete: false },
            deals: { create: false, read: true, update: false, delete: false },
            projects: { create: false, read: true, update: false, delete: false },
            tasks: { create: false, read: true, update: false, delete: false },
            reports: { create: false, read: true, update: false, delete: false },
            imports: { create: false, read: true, update: false, delete: false, import: false },
            exports: { create: false, read: true, update: false, delete: false, export: false },
            users: { create: false, read: true, update: false, delete: false },
            roles: { create: false, read: false, update: false, delete: false },
            settings: { create: false, read: false, update: false, delete: false },
            profile: { read: true, update: false, changePassword: false }
        }
    }
];

async function addRole(role) {
    try {
        console.log(`\n📝 Adding role: ${role.name}...`);

        const response = await fetch(`${API_URL}/user-roles`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ data: role })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error?.message || `HTTP ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();
        console.log(`✅ Successfully added: ${role.name} (ID: ${data.data.id})`);
        return data;
    } catch (error) {
        console.error(`❌ Error adding ${role.name}:`, error.message);
        throw error;
    }
}

async function checkExistingRoles() {
    try {
        console.log('🔍 Checking existing roles...\n');

        const response = await fetch(`${API_URL}/user-roles`);

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();
        const existingRoleNames = data.data.map(role => role.attributes?.name || role.name);

        console.log('📋 Existing roles in database:');
        existingRoleNames.forEach(name => console.log(`   - ${name}`));

        return existingRoleNames;
    } catch (error) {
        console.error('❌ Error checking existing roles:', error.message);
        throw error;
    }
}

async function main() {
    console.log('🚀 Starting role migration...');
    console.log(`📡 Strapi URL: ${STRAPI_URL}\n`);

    try {
        // Check existing roles
        const existingRoles = await checkExistingRoles();

        // Filter out roles that already exist
        const rolesToAdd = missingRoles.filter(role => !existingRoles.includes(role.name));

        if (rolesToAdd.length === 0) {
            console.log('\n✨ All roles already exist in the database!');
            return;
        }

        console.log(`\n📦 Found ${rolesToAdd.length} missing roles to add:`);
        rolesToAdd.forEach(role => console.log(`   - ${role.name}`));
        console.log('');

        // Add each missing role
        for (const role of rolesToAdd) {
            await addRole(role);
            // Small delay to avoid rate limiting
            await new Promise(resolve => setTimeout(resolve, 100));
        }

        console.log('\n✅ All missing roles have been added successfully!');
        console.log('\n📊 Summary:');
        console.log(`   Total roles to add: ${missingRoles.length}`);
        console.log(`   Already existed: ${missingRoles.length - rolesToAdd.length}`);
        console.log(`   Newly added: ${rolesToAdd.length}`);

    } catch (error) {
        console.error('\n❌ Migration failed:', error.message);
        process.exit(1);
    }
}

// Run the script
main();

