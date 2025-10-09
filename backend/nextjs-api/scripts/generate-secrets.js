#!/usr/bin/env node

/**
 * Secret Generator for Xtrawrkx Backend API
 * Generates cryptographically secure secrets for production deployment
 */

const crypto = require('crypto')

// Generate a random string of specified length
function generateSecret(length = 64) {
    return crypto.randomBytes(length).toString('hex')
}

// Generate a base64 secret
function generateBase64Secret(length = 64) {
    return crypto.randomBytes(length).toString('base64')
}

// Generate JWT secret (minimum 32 characters)
function generateJWTSecret() {
    return generateSecret(32)
}

// Generate NextAuth secret (minimum 32 characters)
function generateNextAuthSecret() {
    return generateSecret(32)
}

// Generate API key
function generateAPIKey() {
    return 'xtrw_' + generateSecret(32)
}

// Generate webhook secret
function generateWebhookSecret() {
    return 'whsec_' + generateSecret(24)
}

console.log('🔐 XTRAWRKX SECRETS GENERATOR')
console.log('='.repeat(50))
console.log('')

console.log('📋 Copy these secrets to your production environment:')
console.log('')

console.log('# Authentication Secrets')
console.log(`JWT_SECRET="${generateJWTSecret()}"`)
console.log(`NEXTAUTH_SECRET="${generateNextAuthSecret()}"`)
console.log('')

console.log('# API Keys')
console.log(`API_SECRET_KEY="${generateAPIKey()}"`)
console.log('')

console.log('# Webhook Secrets (if using Stripe or other webhooks)')
console.log(`WEBHOOK_SECRET="${generateWebhookSecret()}"`)
console.log('')

console.log('# Database Encryption Key (for sensitive data)')
console.log(`DATABASE_ENCRYPTION_KEY="${generateBase64Secret(32)}"`)
console.log('')

console.log('# Session Secret (for additional security)')
console.log(`SESSION_SECRET="${generateSecret(32)}"`)
console.log('')

console.log('⚠️  IMPORTANT SECURITY NOTES:')
console.log('• Store these secrets securely in your environment variables')
console.log('• Never commit secrets to version control')
console.log('• Use different secrets for each environment (dev, staging, prod)')
console.log('• Rotate secrets regularly in production')
console.log('• Use a secrets management service in production (AWS Secrets Manager, Azure Key Vault, etc.)')
console.log('')

console.log('🚀 Next Steps:')
console.log('1. Copy the secrets above to your production .env file')
console.log('2. Set up your PostgreSQL database connection string')
console.log('3. Configure Firebase Admin SDK credentials')
console.log('4. Set up SMTP email configuration')
console.log('5. Configure CORS allowed origins for your domains')
console.log('')

