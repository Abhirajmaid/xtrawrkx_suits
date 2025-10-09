import { NextRequest, NextResponse } from 'next/server'
import { verifyEmailConfig, sendEmail } from '@/lib/email'
import { withCors } from '@/lib/cors'

export const OPTIONS = withCors(async (request: NextRequest) => {
    return new NextResponse(null, { status: 200 })
})

export const POST = withCors(async (req: NextRequest) => {
    try {
        const { action, to, subject, message } = await req.json()

        if (action === 'verify') {
            // Verify email configuration
            const result = await verifyEmailConfig()

            if (result.success) {
                return NextResponse.json({
                    message: 'Email configuration is valid',
                    success: true
                })
            } else {
                return NextResponse.json({
                    error: 'Email configuration failed',
                    details: result.error,
                    success: false
                }, { status: 400 })
            }
        }

        if (action === 'test') {
            // Send test email
            if (!to || !subject || !message) {
                return NextResponse.json({
                    error: 'Missing required fields: to, subject, message'
                }, { status: 400 })
            }

            const success = await sendEmail({
                to,
                subject,
                html: `<p>${message}</p>`,
                text: message
            })

            if (success) {
                return NextResponse.json({
                    message: 'Test email sent successfully',
                    success: true
                })
            } else {
                return NextResponse.json({
                    error: 'Failed to send test email',
                    success: false
                }, { status: 500 })
            }
        }

        return NextResponse.json({
            error: 'Invalid action. Use "verify" or "test"'
        }, { status: 400 })

    } catch (error) {
        console.error('Email test error:', error)
        return NextResponse.json({
            error: 'Internal server error',
            details: error instanceof Error ? error.message : 'Unknown error'
        }, { status: 500 })
    }
})

