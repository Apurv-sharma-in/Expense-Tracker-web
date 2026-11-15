const { Sequelize, json } = require("sequelize");
const createExpenseTable = require("../models/expense");

const addExpense = async (req, res) => {
  try {
    const { amount, description, category } = req.body;
    const addDataInExpense = await createExpenseTable.create({
      amount: amount,
      description: description,
      category: category,
      userId: req.user.userId
    });
    res.status(201).json("Amount Added Successfully");
  } catch (error) {
    res.status(500).json("Unabel To add");
  }
};

const getAllExpense = async (req, res) => {
  try {
    const fetchAllUser = await createExpenseTable.findAll({
        where:{userId:req.user.userId}
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
      {amount,description,category},
      {
        where: {
          id: id,
          userId:req.user.userId
        },
      },
    );
    if (id === 0) {
      (res.send(404), json("Expense Not Found"));
    }
    (res.send(201), json("Expense Edit Successfully"));
  } catch (error) {
    console.log(error);
    res.status(500).json("Unabel to Edit");
  }
};

const deleteExpense = async (req, res) => {
  try {
    const { id } = req.params;
    const removeExpense = await createExpenseTable.destroy({
      where: {
        id: id,
      },
    });
    if (id === 0) {
      res.status(404).json("Unable to Delete");
    }
    res.status(200).json("Expense Deleted Successfully");
  } catch (error) {
    res.status(500).json(error);
  }
};

module.exports = {
    addExpense,
    getAllExpense,
    editExpense,
    deleteExpense
};