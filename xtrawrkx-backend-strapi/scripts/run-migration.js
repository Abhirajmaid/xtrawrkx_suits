#!/usr/bin/env node

/**
 * Run department migration script
 * This script creates default departments in the Strapi backend
 */

const fetch = require('node-fetch');

const API_BASE_URL = process.env.STRAPI_URL || 'http://localhost:1337/api';

async function runMigration() {
    console.log('🚀 Starting department migration...');
    console.log('API Base URL:', API_BASE_URL);

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

    let createdCount = 0;
    let skippedCount = 0;

    for (const deptData of defaultDepartments) {
        try {
            console.log(`📝 Creating department: ${deptData.name}...`);

            const response = await fetch(`${API_BASE_URL}/departments`, {
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
                createdCount++;
            } else {
                const errorData = await response.json().catch(() => ({}));
                if (response.status === 400 && errorData.error?.message?.includes('already exists')) {
                    console.log(`⚠️  Department ${deptData.name} already exists, skipping...`);
                    skippedCount++;
                } else {
                    console.error(`❌ Error creating department ${deptData.name}:`, errorData.error?.message || response.statusText);
                }
            }
        } catch (error) {
            console.error(`❌ Error creating department ${deptData.name}:`, error.message);
        }
    }

    console.log('\n📊 Migration Summary:');
    console.log(`✅ Created: ${createdCount} departments`);
    console.log(`⚠️  Skipped: ${skippedCount} departments`);
    console.log(`📋 Total: ${defaultDepartments.length} departments processed`);

    if (createdCount > 0) {
        console.log('\n🎉 Migration completed successfully!');
        console.log('📋 Next steps:');
        console.log('1. Restart your Strapi server');
        console.log('2. Test the user creation flow in the frontend');
        console.log('3. Verify departments are loading correctly');
    } else {
        console.log('\n✅ All departments already exist, no migration needed.');
    }
}

// Run migration if this script is executed directly
if (require.main === module) {
    runMigration().catch(error => {
        console.error('❌ Migration failed:', error);
        process.exit(1);
    });
}

module.exports = { runMigration };
