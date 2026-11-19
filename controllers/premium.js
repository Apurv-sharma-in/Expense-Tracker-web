const sequelize = require('../utils/db');
const User = require('../models/user');
const Expense = require('../models/expense');

const getAllExpense = async (req, res) => {
    try {
        const leaderboard = await User.findAll({
            attributes: ['name', 'totalExpense'],
            order: [['totalExpense', 'DESC']]
        });

        res.status(200).json(leaderboard);
    } catch (error) {
        console.error('Leaderboard Error:', error);
        res.status(500).json({ message: 'Failed to load leaderboard' });
    }
};

module.exports = { getAllExpense };
