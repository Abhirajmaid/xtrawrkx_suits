 /** @type {import('next').NextConfig} */
const nextConfig = {
    transpilePackages: ['@xtrawrkx/ui', '@xtrawrkx/utils'],
    experimental: {
        externalDir: true,
    },
}

module.exports = nextConfig
