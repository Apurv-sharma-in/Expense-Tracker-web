const express = require("express");
const router = express.Router();
const userController = require('../controllers/user');
const expenseController =  require('../controllers/expense');
const authentication = require('../middleware/auth');

router.post('/signup',userController.createUser);
router.post('/login',userController.checkLogin);


router.get('/',authentication, expenseController.getAllExpense);
router.post('/',authentication,expenseController.addExpense);
router.put('/:id',authentication,expenseController.editExpense);
router.delete('/:id',authentication,expenseController.deleteExpense);


module.exports = router;
