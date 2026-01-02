import sgMail from '@sendgrid/mail';

sgMail.setApiKey(process.env.SENDGRID_API_KEY!);

export class SendGridService {
    constructor() {
        if (process.env.SENDGRID_API_KEY) {
            throw new Error("SENDGRID_API_KEY")
        }
    }
    async sendVerificationEmail(to: string, from: string, msg: string) {
        sgMail.send({
            to,
            from,
            subject: 'Verification Email',
            text: msg
        })
    }

    async sendPasswordResetEmail(to: string, from: string, msg: string) {
        sgMail.send({
            to,
            from,
            subject: 'Password Reset',
            text: msg
        })
    }


}