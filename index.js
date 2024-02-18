const express = require("express")
const { connection } = require("./config/db")
const { userRouter } = require("./routes/user.routes")
const { noteRouter } = require("./routes/note.routes")
const cors = require("cors")
require("dotenv").config()
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const app = express()
app.use(express.json())
app.use(cors())
// error

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'User Management System',
            version: '1.0.0',
        },
        servers:[
            {
                url:'https://localhost:4500/'
            },
            {
                url:'https://example.com/'
            }
        ]
    },
    apis: ['./routes/*.js'],
};

const openapiSpecification = swaggerJsdoc(options);

app.use("/apidocs",swaggerUi.serve,swaggerUi.setup(openapiSpecification))
app.use("/users", userRouter)
app.use("/notes", noteRouter)

app.get('/', (req, res) => {
    res.send({ "msg": "This is the home page....." })
})
// app.post('/',(req,res)=>{
//     const data = req.body;
//     res.send({"msg":data})
// })

app.listen(process.env.port, async () => {
    try {
        await connection
        console.log("Connected to the DB")
        console.log(`Server is running at port ${'http://localhost:4500/'}`)
    } catch (err) {
        console.log(err)
    }
})