const {Sequelize} = require("sequelize");

const sequelize = new Sequelize("expense_tracker" ,"root","root",{
    host:"localhost",
    dialect:"mysql"
});

const checkConnection = async ()=>{
    try {
        await sequelize.authenticate();
        console.log("DB Connected Successfully");
    } catch (error) {
        console.log("DB Connection Failed",error);
    }
}

checkConnection();
module.exports = sequelize;