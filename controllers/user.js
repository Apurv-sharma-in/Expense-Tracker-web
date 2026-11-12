const {Sequelize} = require('sequelize');
const userTable =require('../models/user');

const createUser = async (req,res) =>{
    try {
       const {name ,email ,password} = req.body;
       const existingUser = await userTable.findOne({ where: { email: email } });

        if (existingUser) {
            return res.status(409).json({ message: 'User already exists with this email. Please login.' });
        }
       const createUser = await userTable.create({
        name:name,
        email:email,
        password:password
       })  
       res.status(201).send('User added Successfully');
    } catch (error) {
        res.status(500).json('unbale to create user');
    }
};
module.exports ={
    createUser
}