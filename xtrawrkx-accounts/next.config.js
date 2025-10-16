/** @type {import('next').NextConfig} */
const nextConfig = {
    transpilePackages: ['@xtrawrkx/ui', '@xtrawrkx/utils'],
    env: {
        NEXT_PUBLIC_STRAPI_URL: process.env.NEXT_PUBLIC_STRAPI_URL || 'https://xtrawrkxsuits-production.up.railway.app',
    },
    async rewrites() {
        return [
            {
                source: '/api/:path*',
                destination: `${process.env.NEXT_PUBLIC_STRAPI_URL || 'https://xtrawrkxsuits-production.up.railway.app'}/api/:path*`,
            },
        ]
    },
}

module.exports = nextConfig
