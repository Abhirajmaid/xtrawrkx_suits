/** @type {import('next').NextConfig} */
const nextConfig = {
    transpilePackages: ['@xtrawrkx/ui', '@xtrawrkx/utils'],
    env: {
        NEXT_PUBLIC_STRAPI_URL: process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337',
    },
    async rewrites() {
        return [
            {
                source: '/api/:path*',
                destination: `${process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337'}/api/:path*`,
            },
        ]
    },
}

module.exports = nextConfig
