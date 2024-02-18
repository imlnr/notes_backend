const express = require("express")
const { NoteModel } = require("../model/note.model")
const { auth } = require("../middlewares/auth.middleware")

const noteRouter = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     note:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: This is the id
 *         title:
 *           type: string
 *           description: This is the title
 *         body:
 *           type: string
 *           description: This is notes body text
 */


/**
 * @swagger
 * /notes:
 *   post:
 *     summary: Add a new note
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: Creates a new note.
 *         requestBody:
 *           required: true
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/note'
 *       500:
 *         description: Internal server error
 */

noteRouter.post("/", auth, async (req, res) => {
    try {
        const note = new NoteModel(req.body)
        await note.save()
        res.send({ "msg": "New note has been added" })
    } catch (err) {
        res.send({ "error": err })
    }
})

//get the notes opd logged in user or a user can read his/her notes only
noteRouter.get("/", auth, async (req, res) => {
    try {
        //userid in notes===userid who is making the request
        const notes = await NoteModel.find({ userID: req.body.userID })
        res.send({ notes })
    } catch (err) {
        res.send({ "error": err })
    }
})

noteRouter.patch("/:noteID", auth, async (req, res) => {
    const { noteID } = req.params
    try {
        //userID presnt in note === userID in the req.body
        const note = await NoteModel.findOne({ _id: noteID })
        if (note.userID == req.body.userID) {
            await NoteModel.findByIdAndUpdate({ _id: noteID }, req.body)
            res.send({ "msg": `The note with ID:${noteID} has been updated` })
        } else {
            res.send({ "msg": "you are not authorised" })
        }
    } catch (err) {
        res.send({ "error": err })
    }
})

noteRouter.delete("/:noteID", auth, async (req, res) => {
    const { noteID } = req.params
    try {
        //userID presnt in note === userID in the req.body
        const note = await NoteModel.findOne({ _id: noteID })
        if (note.userID == req.body.userID) {
            await NoteModel.findByIdAndDelete({ _id: noteID })
            res.send({ "msg": `The note with ID:${noteID} has been deleted` })
        } else {
            res.send({ "msg": "you are not authorised" })
        }
    } catch (err) {
        res.send({ "error": err })
    }
})

module.exports = {
    noteRouter
}