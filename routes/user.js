const express = require("express");
const router = express.Router();
const userController = require('../controllers/user')
const expenseController =  require('../controllers/expense')

router.post('/signup',userController.createUser);
router.post('/login',userController.checkLogin);


router.get('/',expenseController.getAllExpense);
router.post('/',expenseController.addExpense);
router.put('/:id',expenseController.editExpense);
router.delete('/:id',expenseController.deleteExpense);


module.exports = router;
