async function testLogin() {
    try {
        console.log('Testing login endpoint...');

        const response = await fetch('http://localhost:1337/api/auth/internal/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: 'admin@xtrawrkx.com',
                password: 'admin123'
            }),
        });

        console.log('Response status:', response.status);
        console.log('Response headers:', Object.fromEntries(response.headers.entries()));

        const data = await response.text();
        console.log('Response body:', data);

        if (response.ok) {
            console.log('✅ Login successful!');
            return JSON.parse(data);
        } else {
            console.log('❌ Login failed');
            return null;
        }
    } catch (error) {
        console.error('Error testing login:', error);
        return null;
    }
}

// Test the endpoint
testLogin();
