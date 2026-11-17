const {Sequelize, DataTypes} = require('sequelize');
const sequelize = require("../utils/db");

const createOrder = sequelize.define('order',{
    id:{
        type:DataTypes.INTEGER,
        autoIncrement:true,
        primaryKey:true
    },
    productId:{
        type:DataTypes.STRING,
        allowNull:true,
    }, 
    orderId:{
        type:DataTypes.STRING,
        unique:true
    },
    status:{
        type:DataTypes.STRING,
         defaultValue: 'pending',
         allowNull: false
    } 
});
module.exports = createOrder;