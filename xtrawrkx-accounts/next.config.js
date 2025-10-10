/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental: {
        transpilePackages: ['@xtrawrkx/ui', '@xtrawrkx/utils'],
    },
    async rewrites() {
        return [
            {
                source: '/api/:path*',
                destination: 'http://localhost:3004/api/:path*', // Backend API
            },
        ]
    },
}

module.exports = nextConfig
