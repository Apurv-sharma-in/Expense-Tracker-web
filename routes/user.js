const express = require("express");
const router = express.Router();
const userController = require('../controllers/user');
const expenseController =  require('../controllers/expense');
const authentication = require('../middleware/auth');
const purchaseController = require('../controllers/order');
const leaderboard = require('../controllers/premium');
const passwordController = require('../controllers/passwordForget');

router.post('/signup',userController.createUser);
router.post('/login',userController.checkLogin);


router.get('/',authentication, expenseController.getAllExpense);
router.post('/',authentication,expenseController.addExpense);
router.put('/:id',authentication,expenseController.editExpense);
router.delete('/:id',authentication,expenseController.deleteExpense);


router.post('/premiummembership', authentication, purchaseController.purchasePremium);
router.post('/updatetransactionstatus', authentication, purchaseController.updateTransactionStatus);

router.get('/leaderboard',authentication,leaderboard.getAllExpense);


router.post('/suggestCategory',authentication,expenseController.suggestCategory);

router.post('/forgotpassword', passwordController.forgetPassword);
router.get('/resetpassword/:id', passwordController.resetPasswordForm);
router.post('/updatepassword/:id', passwordController.updatePassword);

module.exports = router;
