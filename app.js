const express = require('express');
const app = express();

//connect db 
const db = require("./utils/db");

//router 
const userRouter = require('./routes/user')

//moudle
const user = require('./models/user');
const expense = require('./models/expense');

user.hasMany(expense);
expense.belongsTo(user);

const cors = require('cors');
app.use(cors());
app.use(express.json());

app.use('/user',userRouter);



db.sync({force:true}).then(()=>{
    app.listen(3000,()=>{
        console.log('Server is Running');
    })
}).catch((err)=>{
    console.log(err);
})

