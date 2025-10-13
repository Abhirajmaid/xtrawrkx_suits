#!/usr/bin/env node

/**
 * Test script for Firebase Auth + Strapi integration
 * This script helps verify that the integration is working correctly
 */

const admin = require('firebase-admin');
const fetch = require('node-fetch');

// Configuration
const STRAPI_URL = process.env.STRAPI_URL || 'http://localhost:1337';
const TEST_USER_EMAIL = 'test@example.com';
const TEST_USER_DATA = {
    firstName: 'Test',
    lastName: 'User',
    role: 'DEVELOPER',
    department: 'DEVELOPMENT'
};

async function testStrapiConnection() {
    console.log('🔍 Testing Strapi connection...');

    try {
        const response = await fetch(`${STRAPI_URL}/api/xtrawrkx-users`);
        if (response.ok) {
            console.log('✅ Strapi is accessible');
            return true;
        } else {
            console.log('❌ Strapi connection failed:', response.status);
            return false;
        }
    } catch (error) {
        console.log('❌ Strapi connection error:', error.message);
        return false;
    }
}

async function testFirebaseAdmin() {
    console.log('🔍 Testing Firebase Admin SDK...');

    try {
        // Check if Firebase Admin is initialized
        if (admin.apps.length === 0) {
            console.log('⚠️  Firebase Admin SDK not initialized');
            console.log('   Make sure to set the following environment variables:');
            console.log('   - FIREBASE_PROJECT_ID');
            console.log('   - FIREBASE_PRIVATE_KEY');
            console.log('   - FIREBASE_CLIENT_EMAIL');
            return false;
        }

        // Test Firebase Admin functionality
        const app = admin.app();
        console.log('✅ Firebase Admin SDK initialized for project:', app.options.projectId);
        return true;
    } catch (error) {
        console.log('❌ Firebase Admin error:', error.message);
        return false;
    }
}

async function testUserCreation() {
    console.log('🔍 Testing user creation in Strapi...');

    try {
        const response = await fetch(`${STRAPI_URL}/api/xtrawrkx-users`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                data: {
                    email: TEST_USER_EMAIL,
                    firebaseUid: 'test-firebase-uid-' + Date.now(),
                    ...TEST_USER_DATA,
                    authProvider: 'FIREBASE',
                    isActive: true,
                }
            }),
        });

        if (response.ok) {
            const data = await response.json();
            console.log('✅ User created successfully:', data.data.id);
            return data.data.id;
        } else {
            const error = await response.text();
            console.log('❌ User creation failed:', error);
            return null;
        }
    } catch (error) {
        console.log('❌ User creation error:', error.message);
        return null;
    }
}

async function testOnboardingData(userId) {
    console.log('🔍 Testing onboarding data update...');

    try {
        const onboardingData = {
            onboardingCompleted: true,
            onboardingCompletedAt: new Date().toISOString(),
            communityPreferences: ['XEN', 'XEVFIN'],
            onboardingData: {
                basics: { interests: ['blockchain', 'defi'] },
                communities: ['XEN', 'XEVFIN'],
                submissions: {
                    XEN: { experience: 'Beginner', goals: 'Learn about XEN' }
                }
            }
        };

        const response = await fetch(`${STRAPI_URL}/api/xtrawrkx-users/${userId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ data: onboardingData }),
        });

        if (response.ok) {
            console.log('✅ Onboarding data updated successfully');
            return true;
        } else {
            const error = await response.text();
            console.log('❌ Onboarding data update failed:', error);
            return false;
        }
    } catch (error) {
        console.log('❌ Onboarding data update error:', error.message);
        return false;
    }
}

async function cleanup(userId) {
    console.log('🧹 Cleaning up test data...');

    try {
        if (userId) {
            await fetch(`${STRAPI_URL}/api/xtrawrkx-users/${userId}`, {
                method: 'DELETE',
            });
            console.log('✅ Test user deleted');
        }
    } catch (error) {
        console.log('⚠️  Cleanup error:', error.message);
    }
}

async function runTests() {
    console.log('🚀 Starting Firebase Auth + Strapi Integration Tests\n');

    let testUserId = null;
    let allTestsPassed = true;

    try {
        // Test 1: Strapi Connection
        const strapiOk = await testStrapiConnection();
        if (!strapiOk) allTestsPassed = false;

        console.log('');

        // Test 2: Firebase Admin
        const firebaseOk = await testFirebaseAdmin();
        if (!firebaseOk) allTestsPassed = false;

        console.log('');

        // Test 3: User Creation
        testUserId = await testUserCreation();
        if (!testUserId) allTestsPassed = false;

        console.log('');

        // Test 4: Onboarding Data
        if (testUserId) {
            const onboardingOk = await testOnboardingData(testUserId);
            if (!onboardingOk) allTestsPassed = false;
        }

        console.log('');

    } finally {
        // Cleanup
        await cleanup(testUserId);
    }

    console.log('\n📊 Test Results:');
    if (allTestsPassed) {
        console.log('✅ All tests passed! Integration is working correctly.');
    } else {
        console.log('❌ Some tests failed. Please check the configuration.');
        process.exit(1);
    }
}

// Run tests if this script is executed directly
if (require.main === module) {
    runTests().catch(console.error);
}

module.exports = { runTests };



