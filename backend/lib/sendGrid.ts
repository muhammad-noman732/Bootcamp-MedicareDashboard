import sgMail from '@sendgrid/mail';
import { NotFoundError, InternalServerError } from '../utils/appError';

export class SendGridService {
    private readonly fromEmail: string;
    private readonly fromName: string;

    constructor() {
        // Check if API key exists
        if (!process.env.SENDGRID_API_KEY) {
            throw new NotFoundError("SENDGRID_API_KEY is required in environment variables");
        }

        if (!process.env.SENDGRID_FROM_EMAIL) {
            throw new NotFoundError("SENDGRID_FROM_EMAIL is required in environment variables");
        }

        sgMail.setApiKey(process.env.SENDGRID_API_KEY);
        this.fromEmail = process.env.SENDGRID_FROM_EMAIL;
        this.fromName = process.env.SENDGRID_FROM_NAME || 'Medicare Dashboard';
    }

    async sendVerificationEmail(to: string, userName: string, htmlContent: string): Promise<void> {
        try {
            await sgMail.send({
                to,
                from: {
                    email: this.fromEmail,
                    name: this.fromName
                },
                subject: 'Verify Your Email - Medicare Dashboard',
                html: htmlContent,
            });
        } catch (error) {
            console.error('SendGrid Error:', error);
            throw new InternalServerError(
                `Failed to send verification email: ${error instanceof Error ? error.message : 'Unknown error'}`
            );
        }
    }

    async sendPasswordResetEmail(to: string, userName: string, htmlContent: string): Promise<void> {
        try {
            await sgMail.send({
                to,
                from: {
                    email: this.fromEmail,
                    name: this.fromName
                },
                subject: 'Password Reset - Medicare Dashboard',
                html: htmlContent,
            });
        } catch (error) {
            console.error('SendGrid Error:', error);
            throw new InternalServerError(
                `Failed to send password reset email: ${error instanceof Error ? error.message : 'Unknown error'}`
            );
        }
    }
}