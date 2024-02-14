const express = require('express');
const { connection } = require('./config/db');
const { userRouter } = require('./routes/user.route');
const { noteRouter } = require('./routes/note.route');
require('dotenv').config();
const app = express();

app.use(express.json())
app.use('/users', userRouter);
app.use('/notes',noteRouter);

app.listen(process.env.PORT, async () => {
    try {
        await connection
        console.log('Connected to db');
        console.log(`your server is running at port ${process.env.PORT}`);

    } catch (error) {
        console.log(error);
    }
})