// API endpoint for fetching users (contact owners)
import { NextResponse } from 'next/server';

// Mock users data - replace with actual database calls
const users = [
    {
        id: 1,
        name: 'John Smith',
        email: 'john.smith@xtrawrkx.com',
        role: 'Sales Manager',
        active: true
    },
    {
        id: 2,
        name: 'Jane Doe',
        email: 'jane.doe@xtrawrkx.com',
        role: 'Account Executive',
        active: true
    },
    {
        id: 3,
        name: 'Mike Johnson',
        email: 'mike.johnson@xtrawrkx.com',
        role: 'Sales Representative',
        active: true
    },
    {
        id: 4,
        name: 'Sarah Wilson',
        email: 'sarah.wilson@xtrawrkx.com',
        role: 'Business Development Manager',
        active: true
    },
    {
        id: 5,
        name: 'Alex Brown',
        email: 'alex.brown@xtrawrkx.com',
        role: 'Senior Sales Executive',
        active: true
    }
];

export async function GET(request) {
    try {
        // Return active users only
        const activeUsers = users.filter(user => user.active);

        return NextResponse.json(activeUsers);

    } catch (error) {
        console.error('Error fetching users:', error);
        return NextResponse.json(
            { success: false, error: 'Internal server error' },
            { status: 500 }
        );
    }
}


