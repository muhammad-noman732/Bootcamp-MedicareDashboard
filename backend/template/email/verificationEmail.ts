export function verificationEmailTemplate(userName: string, otp: string): string {
    return `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Email Verification</title>
        </head>
        <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
            <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f4f4; padding: 20px;">
                <tr>
                    <td align="center">
                        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                           
                            <tr>
                                <td style="background: linear-gradient(135deg, #2563eb 0%, #1e40af 100%); padding: 40px 20px; text-align: center;">
                                    <h1 style="color: #ffffff; margin: 0; font-size: 28px;">Medicare Dashboard</h1>
                                </td>
                            </tr>
                            
                            
                            <tr>
                                <td style="padding: 40px 30px;">
                                    <h2 style="color: #1f2937; margin: 0 0 20px 0; font-size: 24px;">Verify Your Email</h2>
                                    <p style="color: #4b5563; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
                                        Hi ${userName || 'there'},
                                    </p>
                                    <p style="color: #4b5563; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
                                        Thank you for signing up! Please use the following One-Time Password (OTP) to verify your email address:
                                    </p>
                                    
                                   
                                    <div style="background-color: #f3f4f6; border-radius: 8px; padding: 30px; text-align: center; margin: 30px 0;">
                                        <div style="color: #6b7280; font-size: 14px; margin-bottom: 10px; text-transform: uppercase; letter-spacing: 1px;">Your Verification Code</div>
                                        <div style="font-size: 36px; font-weight: bold; color: #2563eb; letter-spacing: 8px; font-family: 'Courier New', monospace;">
                                            ${otp}
                                        </div>
                                    </div>
                                    
                                    <p style="color: #4b5563; font-size: 14px; line-height: 1.6; margin: 20px 0 0 0;">
                                        <strong>Important:</strong> This code will expire in <strong>10 minutes</strong> for security reasons.
                                    </p>
                                    <p style="color: #6b7280; font-size: 14px; line-height: 1.6; margin: 10px 0 0 0;">
                                        If you didn't create an account with Medicare Dashboard, please ignore this email.
                                    </p>
                                </td>
                            </tr>
                            
                          
                            <tr>
                                <td style="background-color: #f9fafb; padding: 20px 30px; border-top: 1px solid #e5e7eb;">
                                    <p style="color: #6b7280; font-size: 12px; line-height: 1.5; margin: 0; text-align: center;">
                                        This is an automated email. Please do not reply.<br>
                                        © ${new Date().getFullYear()} Medicare Dashboard. All rights reserved.
                                    </p>
                                </td>
                            </tr>
                        </table>
                    </td>
                </tr>
            </table>
        </body>
        </html>
    `;
}


export function passwordResetEmailTemplate(userName: string, resetToken: string): string {
    const baseUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
    const resetLink = `${baseUrl}/auth/reset-password?token=${resetToken}`;

    return `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Password Reset</title>
        </head>
        <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
            <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f4f4; padding: 20px;">
                <tr>
                    <td align="center">
                        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                           
                            <tr>
                                <td style="background: linear-gradient(135deg, #dc2626 0%, #991b1b 100%); padding: 40px 20px; text-align: center;">
                                    <h1 style="color: #ffffff; margin: 0; font-size: 28px;">Password Reset</h1>
                                </td>
                            </tr>
                        
                            <tr>
                                <td style="padding: 40px 30px;">
                                    <h2 style="color: #1f2937; margin: 0 0 20px 0; font-size: 24px;">Reset Your Password</h2>
                                    <p style="color: #4b5563; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
                                        Hi ${userName || 'there'},
                                    </p>
                                    <p style="color: #4b5563; font-size: 16px; line-height: 1.6; margin: 0 0 30px 0;">
                                        We received a request to reset your password. Click the button below to proceed:
                                    </p>
                                    <div style="text-align: center; margin: 30px 0;">
                                        <a href="${resetLink}" 
                                           target="_blank"
                                           style="display: inline-block; padding: 16px 36px; background-color: #dc2626; color: #ffffff !important; text-decoration: none; border-radius: 6px; font-size: 16px; font-weight: bold; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
                                            Reset Password
                                        </a>
                                    </div>
                                   
                                    <p style="color: #6b7280; font-size: 12px; line-height: 1.6; margin: 30px 0 0 0; word-break: break-all;">
                                        If the button above doesn't work, copy and paste this link into your browser:<br>
                                        <a href="${resetLink}" style="color: #2563eb; text-decoration: underline;">${resetLink}</a>
                                    </p>
                                    
                                    <p style="color: #6b7280; font-size: 14px; line-height: 1.6; margin: 20px 0 0 0;">
                                        This link will expire in <strong>15 minutes</strong> for security reasons.
                                    </p>
                                </td>
                            </tr>
                            
                            <tr>
                                <td style="background-color: #f9fafb; padding: 20px 30px; border-top: 1px solid #e5e7eb;">
                                    <p style="color: #6b7280; font-size: 12px; line-height: 1.5; margin: 0; text-align: center;">
                                        This is an automated email. Please do not reply.<br>
                                        © ${new Date().getFullYear()} Medicare Dashboard. All rights reserved.
                                    </p>
                                </td>
                            </tr>
                        </table>
                    </td>
                </tr>
            </table>
        </body>
        </html>
    `;
}
