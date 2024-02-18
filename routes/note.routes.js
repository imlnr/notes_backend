const express = require("express");
const { NoteModel } = require("../model/note.model");
const { auth } = require("../middlewares/auth.middleware");

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
 *     tags: [Notes]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/note'
 *     responses:
 *       200:
 *         description: Creates a new note.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/note'
 *       500:
 *         description: Internal server error
 */
noteRouter.post("/", auth, async (req, res) => {
    try {
        const note = new NoteModel(req.body);
        await note.save();
        res.send({ "msg": "New note has been added" });
    } catch (err) {
        res.send({ "error": err });
    }
});

/**
 * @swagger
 * /notes:
 *   get:
 *     summary: Get notes of the logged-in user
 *     tags: [Notes]
 *     responses:
 *       200:
 *         description: Successfully retrieved the notes
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/note'
 *       500:
 *         description: Internal server error
 */
noteRouter.get("/", auth, async (req, res) => {
    try {
        const notes = await NoteModel.find({ userID: req.body.userID });
        res.send({ notes });
    } catch (err) {
        res.send({ "error": err });
    }
});

/**
 * @swagger
 * /notes/{noteID}:
 *   patch:
 *     summary: Update a note
 *     tags: [Notes]
 *     parameters:
 *       - in: path
 *         name: noteID
 *         required: true
 *         description: ID of the note to be updated
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/note'
 *     responses:
 *       200:
 *         description: Successfully updated the note
 *       403:
 *         description: You are not authorized to update this note
 *       500:
 *         description: Internal server error
 */
noteRouter.patch("/:noteID", auth, async (req, res) => {
    const { noteID } = req.params;
    try {
        const note = await NoteModel.findOne({ _id: noteID });
        if (note.userID === req.body.userID) {
            await NoteModel.findByIdAndUpdate({ _id: noteID }, req.body);
            res.send({ "msg": `The note with ID:${noteID} has been updated` });
        } else {
            res.status(403).send({ "msg": "You are not authorized to update this note" });
        }
    } catch (err) {
        res.status(500).send({ "error": err });
    }
});

/**
 * @swagger
 * /notes/{noteID}:
 *   delete:
 *     summary: Delete a note
 *     tags: [Notes]
 *     parameters:
 *       - in: path
 *         name: noteID
 *         required: true
 *         description: ID of the note to be deleted
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successfully deleted the note
 *       403:
 *         description: You are not authorized to delete this note
 *       500:
 *         description: Internal server error
 */
noteRouter.delete("/:noteID", auth, async (req, res) => {
    const { noteID } = req.params;
    try {
        const note = await NoteModel.findOne({ _id: noteID });
        if (note.userID === req.body.userID) {
            await NoteModel.findByIdAndDelete({ _id: noteID });
            res.send({ "msg": `The note with ID:${noteID} has been deleted` });
        } else {
            res.status(403).send({ "msg": "You are not authorized to delete this note" });
        }
    } catch (err) {
        res.status(500).send({ "error": err });
    }
});

module.exports = {
    noteRouter
};
