import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import nodemailer from 'nodemailer'

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    if (!email || !email.includes('@')) {
      return NextResponse.json(
        { error: 'Valid email is required' },
        { status: 400 }
      )
    }

    // Generate a 6-digit code
    const code = Math.floor(100000 + Math.random() * 900000).toString()

    // Delete any existing codes for this email
    await prisma.emailVerificationCode.deleteMany({
      where: { email }
    })

    // Store the code with 10 minute expiration
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000)
    await prisma.emailVerificationCode.create({
      data: {
        email,
        code,
        expires: expiresAt,
      },
    })

    // Send email with the code
    const transporter = nodemailer.createTransport(process.env.EMAIL_SERVER || '')

    await transporter.sendMail({
      from: process.env.EMAIL_FROM || 'noreply@example.com',
      to: email,
      subject: 'Your Sign-In Code for CineReview',
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
          </head>
          <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
              <h1 style="color: white; margin: 0; font-size: 28px;">CineReview</h1>
              <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0;">Your Entertainment Hub</p>
            </div>

            <div style="background: #f9fafb; padding: 40px 30px; border-radius: 0 0 10px 10px;">
              <h2 style="color: #1f2937; margin-top: 0;">Your Sign-In Code</h2>
              <p style="color: #4b5563; font-size: 16px;">Hello! You requested to sign in to CineReview. Use the code below to complete your sign-in:</p>

              <div style="background: white; border: 2px solid #667eea; border-radius: 8px; padding: 20px; text-align: center; margin: 30px 0;">
                <div style="font-size: 36px; font-weight: bold; letter-spacing: 8px; color: #667eea; font-family: 'Courier New', monospace;">
                  ${code}
                </div>
              </div>

              <p style="color: #6b7280; font-size: 14px; margin-top: 30px;">
                <strong>This code will expire in 10 minutes.</strong>
              </p>

              <p style="color: #6b7280; font-size: 14px;">
                If you didn't request this code, you can safely ignore this email.
              </p>

              <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">

              <p style="color: #9ca3af; font-size: 12px; text-align: center; margin: 0;">
                This is an automated message from CineReview. Please do not reply to this email.
              </p>
            </div>
          </body>
        </html>
      `,
      text: `Your CineReview sign-in code is: ${code}\n\nThis code will expire in 10 minutes.\n\nIf you didn't request this code, you can safely ignore this email.`,
    })

    return NextResponse.json({
      success: true,
      message: 'Verification code sent to your email'
    })
  } catch (error) {
    console.error('Error sending verification code:', error)
    return NextResponse.json(
      { error: 'Failed to send verification code' },
      { status: 500 }
    )
  }
}
