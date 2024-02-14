const express = require('express');
const { auth } = require('../middleware/auth.middleware');
const { NoteModel } = require('../model/note.model');
const noteRouter = express.Router();




noteRouter.post('/', auth, async (req, res) => {
    // res.send({"msg":"Working"})
    try {
        const note = new NoteModel(req.body);
        await note.save();
        res.send({ "msg": "new note has been added..." })
    } catch (error) {
        res.send({ "msg": error })
    }
})

noteRouter.get('/', auth, async (req, res) => {
    try {
        const notes = await NoteModel.find({ userID: req.body.userID });
        res.send({ notes })
    } catch (error) {
        res.send({ "error": error })
    }
})

noteRouter.patch('/:noteId', auth, async (req, res) => {
    const { noteId } = req.params;
    try {
        const note = await NoteModel.findOne({ _id: noteId });
        if (note.userID == req.body.userID) {
            await NoteModel.findByIdAndUpdate({ _id: noteId }, req.body);
            res.send({ "msg": `the note with id ${noteId} has been updated successfully....` })
        }
        else {
            res.send({ "msg": "You are not authorized" })
        }
    } catch (error) {
        res.send({ "error": error })
    }
})

noteRouter.delete('/:noteId', auth, async (req, res) => {
    const { noteId } = req.params;
    try {
        const note = await NoteModel.findOne({ _id: noteId });
        if (note.userID == req.body.userID) {
            await NoteModel.findByIdAndDelete({ _id: noteId });
            res.send({ "msg": `the note with id ${noteId} has been deleted successfully....` })
        }
        else {
            res.send({ "msg": "You are not authorized" })
        }
    } catch (error) {
        res.send({ "error": error, "temp": "error is getting" })
    }
})



module.exports = {
    noteRouter
}