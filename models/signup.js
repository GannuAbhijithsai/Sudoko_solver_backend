const mongoose=require("mongoose");
const Schema=mongoose.Schema;
const signupSchema=new Schema({
    name:{
        type:String,
        required:true,
        
    },
    email:{
        type:String,
        required:true,
        unique:true,
    },
    username:{
        type:String,
        required:true,
        unique:true,
    },
    password:{
        type:String,
        required:true,
    }
   
});

const Userdetail=mongoose.model("Userdetail",signupSchema);

module.exports=Userdetail;