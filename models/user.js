const {Sequelize, DataTypes} = require("sequelize");
const sequelize = require("../utils/db");

const user = sequelize.define('user',{
    id:{
        type:DataTypes.INTEGER,
        autoIncrement:true,
        primaryKey:true
    },
    name:{
        type:DataTypes.STRING,
        allowNull:false
    },
    email:{
        type:DataTypes.STRING,
        allowNull:false,
        unique:true
    },
    totalExpense:{
        type:DataTypes.INTEGER,
        defaultValue:0
    },
    password:{
        type:DataTypes.STRING,
        allowNull:false
    } ,  isPremium:{
        type:DataTypes.BOOLEAN,
        defaultValue:false
    } 
})
module.exports = user;