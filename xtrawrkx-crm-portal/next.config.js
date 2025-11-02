/** @type {import('next').NextConfig} */
const nextConfig = {
    // transpilePackages: ['@xtrawrkx/ui', '@xtrawrkx/utils'],
    experimental: {
        externalDir: true,
    },
    async headers() {
        return [
            {
                // Apply security headers to all routes
                source: '/(.*)',
                headers: [
                    {
                        key: 'X-Robots-Tag',
                        value: 'noindex, nofollow, nocache, noarchive, nosnippet, noimageindex'
                    },
                    {
                        key: 'X-Frame-Options',
                        value: 'DENY'
                    },
                    {
                        key: 'X-Content-Type-Options',
                        value: 'nosniff'
                    },
                    {
                        key: 'Referrer-Policy',
                        value: 'strict-origin-when-cross-origin'
                    },
                    {
                        key: 'Permissions-Policy',
                        value: 'camera=(), microphone=(), geolocation=()'
                    }
                ]
            }
        ]
    }
}

module.exports = nextConfig
