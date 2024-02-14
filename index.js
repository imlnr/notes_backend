const express = require('express');
const { connection } = require('./config/db');
const { userRouter } = require('./routes/user.route');
const { noteRouter } = require('./routes/note.route');
require('dotenv').config();
const cors = require('cors');



const app = express();


app.use(cors());
app.use(express.json())
app.use('/users', userRouter);
app.use('/notes',noteRouter);

app.get('/',(req,res)=>{
    res.send({"msg":"this is the home page...."})
})

app.listen(process.env.port, async () => {
    try {
        await connection
        console.log('Connected to db');
        console.log(`your server is running at port ${process.env.port}`);

    } catch (error) {
        console.log(error);
    }
})