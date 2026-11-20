const user = require('../models/user');
const {sendResetEmail} = require('../services/resetMail')

const forgetPassword = async (req,res) => {
        try {
                const {email} = req.body;
                if(!email){
                    return res.status(400).json({ message: 'Email is required' });
                }
            const existingUser = await user.findOne({
                where:{email}
            });
            if(!existingUser){
                 return res.status(404).json({ message: 'User with this email does not exist' });
        }
        await sendResetEmail(email);

        return res.status(200).json({ message: 'Dummy password reset email sent successfully!' });
        } catch (error) {
            console.error('Brevo Mail Error:', error.response ? error.response.data : error.message);
        return res.status(500).json({ message: 'Failed to send reset email' });
        }
}
module.exports ={
    forgetPassword
}