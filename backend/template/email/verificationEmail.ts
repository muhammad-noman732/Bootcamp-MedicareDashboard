

// template for the verification email
function verificationEmail(to: string, from: string, msg: string) {
    return {
        to,
        from,
        subject: 'Sending with Twilio SendGrid is Fun',
        text: 'and easy to do anywhere, even with Node.js',
        html: '<strong>and easy to do anywhere, even with Node.js</strong>',
    }
}

// template for the password reset email
function passwordResetEmail(to: string, from: string, msg: string) {
    return {
        to,
        from,
        subject: 'Sending with Twilio SendGrid is Fun',
        text: 'and easy to do anywhere, even with Node.js',
        html: '<strong>and easy to do anywhere, even with Node.js</strong>',
    }
}