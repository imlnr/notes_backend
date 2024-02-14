const express = require('express');
const { UserModel } = require('../model/user.model');
const userRouter = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


userRouter.post('/register', (req, res) => {
    const { username, email, pass } = req.body;
    try {
        bcrypt.hash(pass, 8, async (err, hash) => {
            if (hash) {
                const user = new UserModel({ username, email, pass: hash });
                await user.save();
                res.status(200).send({ "msg": "New user has been registered successfully...." })
            }
            else {
                res.send({ "error": err })
            }
        })
    } catch (error) {
        res.send({ "msg": error })
    }
})

userRouter.post('/login', async (req, res) => {
    const { email, pass } = req.body;
    try {
        const user = await UserModel.findOne({ email });
        bcrypt.compare(pass, user.pass, (err, result) => {
            if (result) {
                const token = jwt.sign({ userID: user._id, author: user.username }, "notes");
                res.send({ "msg": "Successfully loggedIn", token })
            } else {
                res.send({ "msg": "Wront Credentials please enter the correct credentials", "error": err })
            }
        })
    } catch (error) {
        res.send({ "error": error });
    }
})


module.exports = {
    userRouter
}