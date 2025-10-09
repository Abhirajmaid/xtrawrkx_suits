import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Starting database seed...');

    // Create User Roles
    const adminRole = await prisma.userRole.upsert({
        where: { id: 'admin-role' },
        update: {},
        create: {
            id: 'admin-role',
            name: 'admin',
            description: 'System Administrator',
            isSystemRole: true,
        },
    });

    const managerRole = await prisma.userRole.upsert({
        where: { id: 'manager-role' },
        update: {},
        create: {
            id: 'manager-role',
            name: 'manager',
            description: 'Project Manager',
            isSystemRole: true,
        },
    });

    const developerRole = await prisma.userRole.upsert({
        where: { id: 'developer-role' },
        update: {},
        create: {
            id: 'developer-role',
            name: 'developer',
            description: 'Software Developer',
            isSystemRole: true,
        },
    });

    console.log('✅ User roles created');

    // Create Xtrawrkx Users
    const hashedPassword = await bcrypt.hash('password123', 10);

    const adminUser = await prisma.xtrawrkxUser.upsert({
        where: { email: 'admin@xtrawrkx.com' },
        update: {},
        create: {
            email: 'admin@xtrawrkx.com',
            firstName: 'Super',
            lastName: 'Admin',
            password: hashedPassword,
            role: 'ADMIN',
            department: 'MANAGEMENT',
            hiredDate: new Date('2023-01-01'),
        },
    });

    console.log('✅ Super Admin user created');

    // Create Client Accounts
    const clientAccount1 = await prisma.account.upsert({
        where: { id: 'client-1' },
        update: {},
        create: {
            id: 'client-1',
            companyName: 'TechCorp Inc.',
            industry: 'Technology',
            type: 'CUSTOMER',
            website: 'https://techcorp.com',
            email: 'contact@techcorp.com',
            phone: '+1-555-0123',
            address: '123 Tech Street',
            city: 'San Francisco',
            state: 'CA',
            zipCode: '94105',
            country: 'USA',
            employees: '50-100',
            ownerId: adminUser.id,
            source: 'ONBOARDING',
        },
    });

    const clientAccount2 = await prisma.account.upsert({
        where: { id: 'client-2' },
        update: {},
        create: {
            id: 'client-2',
            companyName: 'StartupXYZ',
            industry: 'SaaS',
            type: 'CUSTOMER',
            website: 'https://startupxyz.com',
            email: 'hello@startupxyz.com',
            phone: '+1-555-0456',
            address: '456 Innovation Blvd',
            city: 'Austin',
            state: 'TX',
            zipCode: '73301',
            country: 'USA',
            employees: '10-50',
            ownerId: adminUser.id,
            source: 'LEAD_CONVERSION',
        },
    });

    console.log('✅ Client accounts created');

    // Create Contacts
    const contact1 = await prisma.contact.upsert({
        where: { id: 'contact-1' },
        update: {},
        create: {
            id: 'contact-1',
            accountId: clientAccount1.id,
            firstName: 'Sarah',
            lastName: 'Johnson',
            email: 'sarah.johnson@techcorp.com',
            phone: '+1-555-0124',
            title: 'CTO',
            department: 'Engineering',
            role: 'DECISION_MAKER',
            status: 'ACTIVE',
            assignedToId: adminUser.id,
            source: 'ONBOARDING',
        },
    });

    const contact2 = await prisma.contact.upsert({
        where: { id: 'contact-2' },
        update: {},
        create: {
            id: 'contact-2',
            accountId: clientAccount2.id,
            firstName: 'Mike',
            lastName: 'Chen',
            email: 'mike.chen@startupxyz.com',
            phone: '+1-555-0457',
            title: 'CEO',
            department: 'Executive',
            role: 'PRIMARY_CONTACT',
            status: 'ACTIVE',
            assignedToId: adminUser.id,
            source: 'LEAD_CONVERSION',
        },
    });

    console.log('✅ Contacts created');

    // Create Leads
    const lead1 = await prisma.lead.upsert({
        where: { id: 'lead-1' },
        update: {},
        create: {
            id: 'lead-1',
            leadName: 'Jane Smith',
            companyName: 'FutureTech Solutions',
            email: 'jane.smith@futuretech.com',
            phone: '+1-555-0789',
            website: 'https://futuretech.com',
            industry: 'AI/ML',
            size: '100-500',
            status: 'NEW',
            score: 75,
            source: 'EXTENSION',
            assignedToId: adminUser.id,
            notes: 'Interested in AI consulting services',
        },
    });

    const lead2 = await prisma.lead.upsert({
        where: { id: 'lead-2' },
        update: {},
        create: {
            id: 'lead-2',
            leadName: 'Robert Wilson',
            companyName: 'DataFlow Inc.',
            email: 'robert.wilson@dataflow.com',
            phone: '+1-555-0321',
            website: 'https://dataflow.com',
            industry: 'Data Analytics',
            size: '50-100',
            status: 'CONTACTED',
            score: 60,
            source: 'MANUAL',
            assignedToId: adminUser.id,
            notes: 'Looking for data pipeline solutions',
        },
    });

    console.log('✅ Leads created');

    // Create Projects
    const project1 = await prisma.project.upsert({
        where: { id: 'project-1' },
        update: {},
        create: {
            id: 'project-1',
            accountId: clientAccount1.id,
            name: 'TechCorp Website Redesign',
            description: 'Complete redesign of the corporate website with modern UI/UX',
            status: 'IN_PROGRESS',
            startDate: new Date('2024-01-01'),
            endDate: new Date('2024-03-31'),
            budget: 50000.00,
            spent: 25000.00,
            color: '#3B82F6',
            icon: '🌐',
            projectManagerId: adminUser.id,
        },
    });

    const project2 = await prisma.project.upsert({
        where: { id: 'project-2' },
        update: {},
        create: {
            id: 'project-2',
            accountId: clientAccount2.id,
            name: 'StartupXYZ Mobile App',
            description: 'Development of a mobile application for the startup',
            status: 'ACTIVE',
            startDate: new Date('2024-02-01'),
            endDate: new Date('2024-06-30'),
            budget: 75000.00,
            spent: 15000.00,
            color: '#10B981',
            icon: '📱',
            projectManagerId: adminUser.id,
        },
    });

    console.log('✅ Projects created');

    // Create Tasks
    const task1 = await prisma.task.upsert({
        where: { id: 'task-1' },
        update: {},
        create: {
            id: 'task-1',
            projectId: project1.id,
            title: 'Design System Setup',
            description: 'Create and implement the design system for the website',
            status: 'IN_PROGRESS',
            priority: 'HIGH',
            progress: 60,
            dueDate: new Date('2024-01-15'),
            estimatedTime: '2 days',
            assigneeId: adminUser.id,
            section: 'Design',
            source: 'PM_DASHBOARD',
        },
    });

    const task2 = await prisma.task.upsert({
        where: { id: 'task-2' },
        update: {},
        create: {
            id: 'task-2',
            projectId: project2.id,
            title: 'API Development',
            description: 'Develop REST API endpoints for the mobile app',
            status: 'TODO',
            priority: 'MEDIUM',
            progress: 0,
            dueDate: new Date('2024-02-28'),
            estimatedTime: '5 days',
            assigneeId: adminUser.id,
            section: 'Backend',
            source: 'PM_DASHBOARD',
        },
    });

    console.log('✅ Tasks created');

    // Create Communities
    const community1 = await prisma.community.upsert({
        where: { id: 'community-1' },
        update: {},
        create: {
            id: 'community-1',
            name: 'Tech Leaders',
            description: 'Community for technology leaders and CTOs',
            icon: '👑',
            color: '#8B5CF6',
        },
    });

    const community2 = await prisma.community.upsert({
        where: { id: 'community-2' },
        update: {},
        create: {
            id: 'community-2',
            name: 'Startup Founders',
            description: 'Community for startup founders and entrepreneurs',
            icon: '🚀',
            color: '#F59E0B',
        },
    });

    console.log('✅ Communities created');

    // Create Community Memberships
    await prisma.communityMembership.upsert({
        where: { id: 'membership-1' },
        update: {},
        create: {
            id: 'membership-1',
            contactId: contact1.id,
            communityId: community1.id,
            status: 'ACTIVE',
            joinedAt: new Date('2024-01-01'),
            tier: 'Gold',
        },
    });

    await prisma.communityMembership.upsert({
        where: { id: 'membership-2' },
        update: {},
        create: {
            id: 'membership-2',
            contactId: contact2.id,
            communityId: community2.id,
            status: 'ACTIVE',
            joinedAt: new Date('2024-01-01'),
            tier: 'Silver',
        },
    });

    console.log('✅ Community memberships created');

    // Create Email Templates
    const template1 = await prisma.emailTemplate.upsert({
        where: { id: 'template-1' },
        update: {},
        create: {
            id: 'template-1',
            name: 'Welcome Email',
            subject: 'Welcome to Xtrawrkx!',
            content: 'Welcome to our platform. We are excited to work with you.',
            category: 'Onboarding',
            isActive: true,
            createdById: adminUser.id,
        },
    });

    const template2 = await prisma.emailTemplate.upsert({
        where: { id: 'template-2' },
        update: {},
        create: {
            id: 'template-2',
            name: 'Project Update',
            subject: 'Project Status Update',
            content: 'Here is the latest update on your project.',
            category: 'Project Management',
            isActive: true,
            createdById: adminUser.id,
        },
    });

    console.log('✅ Email templates created');

    console.log('🎉 Database seeding completed successfully!');
}

main()
    .catch((e) => {
        console.error('❌ Error during seed:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
