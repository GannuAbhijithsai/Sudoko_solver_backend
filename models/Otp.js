const mongoose=require("mongoose");
const Schema=mongoose.Schema;
const otpSchema=new Schema({
   email:{
    type:String,
    required:true,
 
   },
   otp:{
    type:String,
    default:null,
   },
   created_at:{
    type:Date,
    default:new Date(),
    expires:600,
   }
   
});

const otpdetail=mongoose.model("otpdetail",otpSchema);

module.exports=otpdetail;