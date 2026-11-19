require('dotenv').config();//ai key
const express = require('express');
const app = express();
//ai
 const ai = require('./services/genAi')
//ai
//connect db 
const db = require("./utils/db");

//router 
const userRouter = require('./routes/user')

//moudle
const user = require('./models/user');
const expense = require('./models/expense');
const order= require('./models/order');
//TABLE RELATIONSHIP 
user.hasMany(expense);
expense.belongsTo(user);

user.hasMany(order);
order.belongsTo(user);
//TABLE RELATIONSHIP 

const cors = require('cors');
app.use(cors());
app.use(express.json());

app.use('/user',userRouter);
app.use('/purchase',userRouter)
app.use('/premium',userRouter)



db.sync().then(()=>{
    app.listen(3000,()=>{
        console.log('Server is Running');
    })
}).catch((err)=>{
    console.log(err);
})

