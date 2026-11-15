const {Sequelize} = require('sequelize');
const userTable =require('../models/user');
const bcrypt = require('bcrypt')

const createUser = async (req,res) =>{
    try {
       const {name ,email ,password} = req.body;
       const existingUser = await userTable.findOne({ where: { email: email } });
       const saltRounds =10 ; 
       const haspassword = await bcrypt.hash(password ,saltRounds); 
       
       if (existingUser) {
            return res.status(409).json({ message: 'User already exists with this email. Please login.' });
        }
       const createUser = await userTable.create({
        name:name,
        email:email,
        password:haspassword
       })  
       res.status(201).send('User added Successfully');
    } catch (error) {
        res.status(500).json('unbale to create user');
    }
};

const checkLogin = async (req,res) =>{
    try {
        const {email,password} = req.body;
        const getUser = await userTable.findOne({
            where:{
                email:email
            }
        })
        if (!getUser) {
            return res.status(404).json({ message: 'Email Not Found.' });
        }
        const ispasswordmatch = await bcrypt.compare(password, getUser.password)
        if(!ispasswordmatch){
            return res.status(401).json({ message: 'Wrong Password.' });

        }
    res.status(200).json({ message: 'Welcome.' });
        
    } catch (error) {
        res.status(500).json('unbale to Find user');
    }
}
module.exports ={
    createUser,
    checkLogin
}