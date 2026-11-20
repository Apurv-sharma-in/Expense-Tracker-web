const { Sequelize } = require("sequelize");
const userTable = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
const sequelize = require("../utils/db");
const secretKey = 'a8f5f167f44f4964e6c998dee827110c84928374659102938475610293847561';

const createUser = async (req, res) => {
  try {
    const t = await sequelize.transaction();
    const { name, email, password } = req.body;
    const existingUser = await userTable.findOne({ where: { email: email } });
    const saltRounds = 10;
    const haspassword = await bcrypt.hash(password, saltRounds);

    if (existingUser) {
      return res
        .status(409)
        .json({
          message: "User already exists with this email. Please login.",
        });
    }
    const createUser = await userTable.create({
      name: name,
      email: email,
      password: haspassword,
    });
    await t.commit();
    res.status(201).send("User added Successfully");
  } catch (error) {
    await t.rollback();
    res.status(500).json("unbale to create user");
  }
};

const checkLogin = async (req, res) => {
  try {
    const t = await sequelize.transaction();
    const { email, password } = req.body;
    const getUser = await userTable.findOne({
      where: {
        email: email,
      },
    });
    if (!getUser) {
      return res.status(404).json({ message: "Email Not Found." });
    }
    const ispasswordmatch = await bcrypt.compare(password, getUser.password);
    if (!ispasswordmatch) {
      return res.status(401).json({ message: "Wrong Password." });
    }
    const token = jwt.sign({userId : getUser.id},secretKey);
    await t.commit();
    return res.status(200).json({ 
      message: "Welcome.",
      token:token,
      isPremium: getUser.isPremium 
    });
  } catch (error) {
    await t.rollback();
    res.status(500).json("unbale to Find user");
  }
};

const forgetPassword = async (req,res)=>{
  try {
    
  } catch (error) {
    
  }  
}

module.exports = {
  createUser,
  checkLogin,
};
