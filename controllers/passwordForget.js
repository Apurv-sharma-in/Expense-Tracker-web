const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');
const sequelize = require('../utils/db');
const User = require('../models/user');
const ForgotPasswordRequest = require('../models/forgotPasswordRequest');
const { sendResetEmail } = require('../services/resetMail');

// 1. POST /password/forgotpassword - Generate UUID, save to DB, and email reset link
const forgetPassword = async (req, res) => {
    let t;
    try {
        const { email } = req.body;
        if (!email) {
            return res.status(400).json({ message: 'Email is required' });
        }

        const existingUser = await User.findOne({ where: { email } });
        if (!existingUser) {
            return res.status(404).json({ message: 'User with this email does not exist' });
        }

        t = await sequelize.transaction();
        const requestId = uuidv4();

        await ForgotPasswordRequest.create(
            {
                id: requestId,
                userId: existingUser.id,
                isActive: true
            },
            { transaction: t }
        );

        await t.commit();

        const resetUrl = `http://localhost:3000/password/resetpassword/${requestId}`;
        await sendResetEmail(email, resetUrl);

        return res.status(200).json({ message: 'Password reset link sent to your email!' });
    } catch (error) {
         if (t && !t.finished) {
            await t.rollback();
        }
        console.error('Forgot Password Error:', error.response ? error.response.data : error.message);
        return res.status(500).json({ message: 'Failed to send reset email' });
    }
};

// 2. GET /password/resetpassword/:id - Verify UUID is active & serve HTML password form
const resetPasswordForm = async (req, res) => {
    try {
        const { id } = req.params;

        const resetRequest = await ForgotPasswordRequest.findOne({
            where: { id: id, isActive: true }
        });

        if (!resetRequest) {
            return res.status(400).send('<h2>This password reset link is invalid or has already been used.</h2>');
        }

        return res.status(200).send(`
            <!DOCTYPE html>
            <html>
            <head><title>Reset Password</title></head>
            <body style="font-family: Arial; display: flex; justify-content: center; margin-top: 80px;">
                <form action="/password/updatepassword/${id}" method="POST" style="border: 1px solid #ccc; padding: 24px; border-radius: 8px; width: 320px;">
                    <h2>Set New Password</h2>
                    <label for="newPassword">New Password:</label><br><br>
                    <input type="password" id="newPassword" name="newPassword" placeholder="Enter new password" required style="width: 100%; padding: 8px; box-sizing: border-box;"><br><br>
                    <button type="submit" style="width: 100%; padding: 10px; background: #2563eb; color: white; border: none; border-radius: 4px; cursor: pointer;">Reset Password</button>
                </form>
            </body>
            </html>
        `);
    } catch (error) {
        console.error('Reset Form Error:', error);
        return res.status(500).send('<h2>Something went wrong</h2>');
    }
};

// 3. POST /password/updatepassword/:id - Encrypt new password, update User, & deactivate link
const updatePassword = async (req, res) => {
    let t;
    try {
        const { id } = req.params;
        const { newPassword } = req.body;

        if (!newPassword) {
            return res.status(400).send('<h2>New password is required</h2>');
        }

        t = await sequelize.transaction();

        const resetRequest = await ForgotPasswordRequest.findOne({
            where: { id: id, isActive: true },
            transaction: t
        });

        if (!resetRequest) {
            await t.rollback();
            return res.status(400).send('<h2>Reset link expired or invalid</h2>');
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        await Promise.all([
            User.update(
                { password: hashedPassword },
                { where: { id: resetRequest.userId }, transaction: t }
            ),
            resetRequest.update(
                { isActive: false },
                { transaction: t }
            )
        ]);

        await t.commit();

        return res.status(200).send('<h2>Password updated successfully! You can now close this tab and log in with your new password.</h2>');
    } catch (error) {
        if (t) await t.rollback();
        console.error('Update Password Error:', error);
        return res.status(500).send('<h2>Failed to update password</h2>');
    }
};

module.exports = {
    forgetPassword,
    resetPasswordForm,
    updatePassword
};
