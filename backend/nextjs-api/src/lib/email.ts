import nodemailer from 'nodemailer'
import { NextResponse } from 'next/server'

// Email configuration interface
interface EmailConfig {
    host: string
    port: number
    secure: boolean
    auth: {
        user: string
        pass: string
    }
}

// Email message interface
interface EmailMessage {
    to: string | string[]
    subject: string
    text?: string
    html?: string
    from?: string
}

// Get email configuration from environment variables
const getEmailConfig = (): EmailConfig => {
    const host = process.env.SMTP_HOST || 'smtp.gmail.com'
    const port = parseInt(process.env.SMTP_PORT || '587')
    const secure = process.env.SMTP_SECURE === 'true'
    const user = process.env.SMTP_USER || ''
    const pass = process.env.SMTP_PASS || ''

    if (!user || !pass) {
        throw new Error('SMTP credentials not configured. Please set SMTP_USER and SMTP_PASS environment variables.')
    }

    return {
        host,
        port,
        secure,
        auth: {
            user,
            pass
        }
    }
}

// Create transporter instance
let transporter: nodemailer.Transporter | null = null

const getTransporter = (): nodemailer.Transporter => {
    if (!transporter) {
        const config = getEmailConfig()
        transporter = nodemailer.createTransporter(config)
    }
    return transporter
}

// Send email function
export const sendEmail = async (message: EmailMessage): Promise<boolean> => {
    try {
        const transporter = getTransporter()
        const fromEmail = process.env.FROM_EMAIL || process.env.SMTP_USER || 'noreply@xtrawrkx.com'
        const fromName = process.env.FROM_NAME || 'Xtrawrkx'

        const mailOptions = {
            from: message.from || `${fromName} <${fromEmail}>`,
            to: Array.isArray(message.to) ? message.to.join(', ') : message.to,
            subject: message.subject,
            text: message.text,
            html: message.html
        }

        const info = await transporter.sendMail(mailOptions)
        console.log('Email sent successfully:', info.messageId)
        return true
    } catch (error) {
        console.error('Failed to send email:', error)
        return false
    }
}

// Send welcome email
export const sendWelcomeEmail = async (to: string, firstName: string): Promise<boolean> => {
    const subject = 'Welcome to Xtrawrkx!'
    const html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #333;">Welcome to Xtrawrkx, ${firstName}!</h1>
            <p>Your account has been successfully created. You can now access all Xtrawrkx applications:</p>
            <ul>
                <li><strong>Accounts Portal:</strong> Manage your profile and settings</li>
                <li><strong>CRM Portal:</strong> Customer relationship management</li>
                <li><strong>PM Dashboard:</strong> Project management and tracking</li>
                <li><strong>Client Portal:</strong> Client collaboration space</li>
            </ul>
            <p>If you have any questions, please don't hesitate to contact our support team.</p>
            <p>Best regards,<br>The Xtrawrkx Team</p>
        </div>
    `
    const text = `Welcome to Xtrawrkx, ${firstName}! Your account has been successfully created.`

    return await sendEmail({ to, subject, html, text })
}

// Send password reset email
export const sendPasswordResetEmail = async (to: string, firstName: string, resetToken: string): Promise<boolean> => {
    const resetUrl = `${process.env.ACCOUNTS_URL || 'https://accounts.xtrawrkx.com'}/auth/reset-password?token=${resetToken}`
    const subject = 'Password Reset Request'
    const html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #333;">Password Reset Request</h1>
            <p>Hi ${firstName},</p>
            <p>You requested a password reset for your Xtrawrkx account. Click the button below to reset your password:</p>
            <div style="text-align: center; margin: 30px 0;">
                <a href="${resetUrl}" style="background-color: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block;">Reset Password</a>
            </div>
            <p>If you didn't request this password reset, please ignore this email.</p>
            <p>This link will expire in 1 hour for security reasons.</p>
            <p>Best regards,<br>The Xtrawrkx Team</p>
        </div>
    `
    const text = `Hi ${firstName}, you requested a password reset. Visit this link to reset your password: ${resetUrl}`

    return await sendEmail({ to, subject, html, text })
}

// Send OTP email
export const sendOTPEmail = async (to: string, firstName: string, otp: string): Promise<boolean> => {
    const subject = 'Your Verification Code'
    const html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #333;">Verification Code</h1>
            <p>Hi ${firstName},</p>
            <p>Your verification code is:</p>
            <div style="text-align: center; margin: 30px 0;">
                <div style="background-color: #f8f9fa; border: 2px solid #007bff; padding: 20px; border-radius: 8px; font-size: 24px; font-weight: bold; letter-spacing: 2px;">
                    ${otp}
                </div>
            </div>
            <p>This code will expire in 10 minutes for security reasons.</p>
            <p>If you didn't request this code, please ignore this email.</p>
            <p>Best regards,<br>The Xtrawrkx Team</p>
        </div>
    `
    const text = `Hi ${firstName}, your verification code is: ${otp}`

    return await sendEmail({ to, subject, html, text })
}

// Send notification email
export const sendNotificationEmail = async (to: string, subject: string, content: string): Promise<boolean> => {
    const html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #333;">${subject}</h1>
            <div style="line-height: 1.6;">
                ${content}
            </div>
            <p style="margin-top: 30px;">Best regards,<br>The Xtrawrkx Team</p>
        </div>
    `

    return await sendEmail({ to, subject, html, text: content.replace(/<[^>]*>/g, '') })
}

// Verify email configuration
export const verifyEmailConfig = async (): Promise<{ success: boolean; error?: string }> => {
    try {
        const transporter = getTransporter()
        await transporter.verify()
        return { success: true }
    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Unknown email configuration error'
        }
    }
}

