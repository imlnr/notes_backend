const express = require("express");
const { UserModel } = require("../model/user.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const userRouter = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     user:
 *       type: object
 *       properties:
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

/**
 * @swagger
 * /users/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/user'
 *     responses:
 *       200:
 *         description: New user has been registered!
 *       500:
 *         description: Internal server error
 */
userRouter.post("/register", (req, res) => {
    const { username, email, pass } = req.body;
    try {
        bcrypt.hash(pass, 8, async (err, hash) => {
            if (hash) {
                const user = new UserModel({ username, email, pass: hash });
                await user.save();
                res.send({ "msg": "New user has been registered!" });
            } else {
                res.send({ "msg": "Error creating the hash", "error": err });
            }
        });
    } catch (err) {
        res.send({ "msg": err });
    }
});

/**
 * @swagger
 * /users/login:
 *   post:
 *     summary: Login with existing user credentials
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               pass:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful!
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                 token:
 *                   type: string
 *       401:
 *         description: Wrong credentials
 *       500:
 *         description: Internal server error
 */
userRouter.post("/login", async (req, res) => {
    const { email, pass } = req.body;
    try {
        const user = await UserModel.findOne({ email });
        bcrypt.compare(pass, user.pass, (err, result) => {
            if (result) {
                const token = jwt.sign({ userID: user._id, author: user.username }, "masai");
                res.send({ "msg": "Login successful!", token });
            } else {
                res.status(401).send({ "msg": "Wrong Credentials" });
            }
        });
    } catch (err) {
        res.status(500).send({ "error": err });
    }
});

module.exports = {
    userRouter
};
