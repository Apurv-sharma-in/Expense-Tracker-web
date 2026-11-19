const sequelize = require("../utils/db");
const createExpenseTable = require("../models/expense");
const user = require("../models/user");

const addExpense = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const { amount, description, category } = req.body;

    await createExpenseTable.create(
      {
        amount: amount,
        description: description,
        category: category,
        userId: req.user.userId
      },
      { transaction: t }
    );

    const currentUser = await user.findByPk(req.user.userId, { transaction: t });
    const updateTotal = Number(currentUser.totalExpense) + Number(amount);

    await currentUser.update(
      { totalExpense: updateTotal },
      { transaction: t }
    );

    await t.commit();
    res.status(201).json("Amount Added Successfully");
  } catch (error) {
    await t.rollback();
    console.error(error);
    res.status(500).json("Unabel To add");
  }
};

const getAllExpense = async (req, res) => {
  try {
    const fetchAllUser = await createExpenseTable.findAll({
      where: { userId: req.user.userId }
    });
    res.status(200).json(fetchAllUser);
  } catch (error) {
    res.status(500).json("Unabel to Fetch Expense");
  }
};

const editExpense = async (req, res) => {
  try {
    const { id } = req.params;
    const { amount, description, category } = req.body;
    const [changeExpense] = await createExpenseTable.update(
      { amount, description, category },
      {
        where: {
          id: id,
          userId: req.user.userId
        }
      }
    );
    if (changeExpense === 0) {
      return res.status(404).json("Expense Not Found");
    }
    res.status(201).json("Expense Edit Successfully");
  } catch (error) {
    console.log(error);
    res.status(500).json("Unabel to Edit");
  }
};

const deleteExpense = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const { id } = req.params;

    const expenseToDelete = await createExpenseTable.findOne({
      where: {
        id: id,
        userId: req.user.userId
      },
      transaction: t
    });

    if (!expenseToDelete) {
      await t.rollback();
      return res.status(404).json("Unable to Delete");
    }

    const currentUser = await user.findByPk(req.user.userId, { transaction: t });
    const updateTotal = Number(currentUser.totalExpense) - Number(expenseToDelete.amount);

    await expenseToDelete.destroy({ transaction: t });
    await currentUser.update(
      { totalExpense: updateTotal },
      { transaction: t }
    );

    await t.commit();
    res.status(200).json("Expense Deleted Successfully");
  } catch (error) {
    await t.rollback();
    console.error(error);
    res.status(500).json(error);
  }
};

module.exports = {
  addExpense,
  getAllExpense,
  editExpense,
  deleteExpense
};
