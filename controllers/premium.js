const {Sequelize} = require('sequelize');
const user = require('../models/user');
const expense = require('../models/expense');

const getAllExpense = async (req,res) => {
    try {
        const [fetchAllUser,fetchAllexpense] = await Promise.all([
            user.findAll(),
            expense.findAll()
        ]);
        
        const leaderboard = fetchAllUser.map((user)=>{
            let totalExpense = 0;
            fetchAllexpense.forEach(expense => {
                    if(expense.userId===user.id){
                        totalExpense+= expense.amount;
                    };                
            });
            return {
                name: user.name,
                totalExpense : totalExpense
            };
        });
        leaderboard.sort((a,b)=>b.totalExpense - a.totalExpense);
        res.status(200).json(leaderboard);
    } catch (error) {
         res.status(500).json({ message: 'Something went wrong' });

    }
}
module.exports={
    getAllExpense
}