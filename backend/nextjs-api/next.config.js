/** @type {import('next').NextConfig} */
const nextConfig = {
    // Railway deployment configuration
    output: 'standalone',
    experimental: {
        outputFileTracingRoot: undefined,
    },
    // Environment configuration
    env: {
        CUSTOM_KEY: process.env.CUSTOM_KEY,
    },
};

module.exports = nextConfig;
