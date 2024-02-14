const mongoose=require("mongoose")

//to create the userSchema
const userSchema=mongoose.Schema({
    username:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    pass:{
        type:String,
        required:true
    }
},{
    versionKey:false
})

//create the user model
const UserModel=mongoose.model("user",userSchema)

module.exports={
    UserModel
}