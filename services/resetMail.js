const axios = require('axios');

const sendResetEmail = async (toEmail, resetUrl) => {
    const url = 'https://api.brevo.com/v3/smtp/email';

    const emailData = {
        sender: {
            name: 'Expense Tracker',
            email: process.env.SENDER_EMAIL
        },
        to: [
            {
                email: toEmail
            }
        ],
        subject: 'Password Reset Request - Expense Tracker',
        htmlContent: `
            <h3>Password Reset</h3>
            <p>Click the link below to set a new password:</p>
            <p><a href="${resetUrl}">${resetUrl}</a></p>
        `
    };

    const headers = {
        'accept': 'application/json',
        'api-key': process.env.BREVO_API_KEY,
        'content-type': 'application/json'
    };

    const response = await axios.post(url, emailData, { headers });
    return response.data;
};

module.exports = { sendResetEmail };
