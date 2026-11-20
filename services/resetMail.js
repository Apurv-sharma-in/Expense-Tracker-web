const axios = require('axios');

const sendResetEmail = async (toEmail) => {
    const url = 'https://brevo.com';

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
            <p>Hello,</p>
            <p>This is a dummy password reset email from your Expense Tracker app.</p>
            <p>Click here to reset your password: <a href="http://localhost:3000/password/resetpassword/dummy-id">Reset Password</a></p>
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
