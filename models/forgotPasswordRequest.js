const {Sequelize, DataTypes} =require('sequelize');
const sequelize = require('../utils/db');

const createUuid = sequelize.define('forgetPassword',{
    id:{
        type:DataTypes.UUID,
        primaryKey:true,
        allowNull:false,
        defaultValue:DataTypes.UUIDV4 
    },
    isActive:{
        type:DataTypes.BOOLEAN,
        defaultValue:true
    }
    
    
});
module.exports= createUuid;