const express = require("express")
const { UserModel } = require("../model/user.model")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")

const userRouter = express.Router()


/**
 * @swagger
 * components:
 *   schemas:
 *     user:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: This is the id
 *         username:
 *           type: string
 *           description: This is the user name
 *         email:
 *           type: string
 *           description: This is email
 *         pass:
 *           type: string
 *           description: This is hashed password
 */


userRouter.post("/register", (req, res) => {
    const { username, email, pass } = req.body
    try {
        bcrypt.hash(pass, 8, async (err, hash) => {
            if (hash) {
                const user = new UserModel({ username, email, pass: hash })
                await user.save()
                res.send({ "msg": "New user has been registered!" })
            } else {
                res.send({ "msg": "error creating the hash", "error": err })
            }
        })
    } catch (err) {
        res.send({ "msg": err })
    }
})

userRouter.post("/login", async (req, res) => {
    const { email, pass } = req.body
    try {
        const user = await UserModel.findOne({ email })
        bcrypt.compare(pass, user.pass, (err, result) => {
            if (result) {
                const token = jwt.sign({ userID: user._id, author: user.username }, "masai")
                res.send({ "msg": "Login successful!", token })
            } else {
                res.send({ "msg": "Wrong Credentials" })
            }
        })
    } catch (err) {
        res.send({ "error": err })
    }
})

module.exports = {
    userRouter
}