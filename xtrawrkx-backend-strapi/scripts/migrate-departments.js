/**
 * Migration script to convert department enumeration to relation
 * This script should be run after creating the department API
 */

const { execSync } = require('child_process');

async function migrateDepartments() {
    try {
        console.log('🚀 Starting department migration...');

        // First, create default departments
        console.log('📝 Creating default departments...');

        const defaultDepartments = [
            {
                name: 'Management',
                code: 'MANAGEMENT',
                description: 'Executive and management team',
                color: '#8B5CF6',
                sortOrder: 1
            },
            {
                name: 'Sales',
                code: 'SALES',
                description: 'Sales and business development team',
                color: '#10B981',
                sortOrder: 2
            },
            {
                name: 'Delivery',
                code: 'DELIVERY',
                description: 'Project delivery and implementation team',
                color: '#F59E0B',
                sortOrder: 3
            },
            {
                name: 'Development',
                code: 'DEVELOPMENT',
                description: 'Software development and engineering team',
                color: '#3B82F6',
                sortOrder: 4
            },
            {
                name: 'Design',
                code: 'DESIGN',
                description: 'UI/UX design and creative team',
                color: '#EC4899',
                sortOrder: 5
            }
        ];

        // Create departments
        for (const deptData of defaultDepartments) {
            try {
                const response = await fetch('http://localhost:1337/api/departments', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        data: deptData
                    })
                });

                if (response.ok) {
                    const result = await response.json();
                    console.log(`✅ Created department: ${deptData.name} (ID: ${result.data.id})`);
                } else {
                    console.log(`⚠️  Department ${deptData.name} might already exist`);
                }
            } catch (error) {
                console.error(`❌ Error creating department ${deptData.name}:`, error.message);
            }
        }

        console.log('✅ Department migration completed!');
        console.log('📋 Next steps:');
        console.log('1. Restart your Strapi server');
        console.log('2. Update your frontend to use the new department API');
        console.log('3. Test the user creation flow');

    } catch (error) {
        console.error('❌ Migration failed:', error);
        process.exit(1);
    }
}

// Run migration if this script is executed directly
if (require.main === module) {
    migrateDepartments();
}

module.exports = { migrateDepartments };
