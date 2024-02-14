const mongoose=require("mongoose")

//to create the noteSchema
const noteSchema=mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    body:{
        type:String,
        required:true,
    },
    userID:{
        type:String,
        required:true
    },
    author:{
        type:String,
        required:true
    }
},{
    versionKey:false
})

//create the user model
const NoteModel=mongoose.model("note",noteSchema)

module.exports={
    NoteModel
}