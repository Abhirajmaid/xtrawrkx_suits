#!/usr/bin/env node

/**
 * Production migration script for Railway deployment
 * This script runs department migration on production
 */

const fetch = (url, options) => import('node-fetch').then(({ default: fetch }) => fetch(url, options));

// Use production URL from environment
const API_BASE_URL = process.env.PUBLIC_URL ? `${process.env.PUBLIC_URL}/api` : 'http://localhost:1337/api';

async function runProductionMigration() {
    console.log('🚀 Starting production department migration...');
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
                console.log(`✅ Created department: ${deptData.name} (ID: ${result?.data?.id || 'unknown'})`);
                createdCount++;
            } else {
                const errorData = await response.json().catch(() => ({}));
                if (response.status === 400 && errorData?.error?.message?.includes('already exists')) {
                    console.log(`⚠️  Department ${deptData.name} already exists, skipping...`);
                    skippedCount++;
                } else {
                    console.error(`❌ Error creating department ${deptData.name}:`, errorData?.error?.message || response.statusText);
                }
            }
        } catch (error) {
            console.error(`❌ Error creating department ${deptData.name}:`, error.message);
        }
    }

    console.log('\n📊 Production Migration Summary:');
    console.log(`✅ Created: ${createdCount} departments`);
    console.log(`⚠️  Skipped: ${skippedCount} departments`);
    console.log(`📋 Total: ${defaultDepartments.length} departments processed`);

    if (createdCount > 0) {
        console.log('\n🎉 Production migration completed successfully!');
    } else {
        console.log('\n✅ All departments already exist in production, no migration needed.');
    }
}

// Run migration if this script is executed directly
if (require.main === module) {
    runProductionMigration().catch(error => {
        console.error('❌ Production migration failed:', error);
        process.exit(1);
    });
}

module.exports = { runProductionMigration };
