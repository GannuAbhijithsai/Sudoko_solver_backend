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
    },
    puzzles:[{board:[[Number]]}],
    solvedBoards: [{
        board: [[Number]], // Sudoku board (2D array of numbers)
        timeTaken: String, // Time taken to solve the puzzle (formatted as HH:MM:SS)
      }],
   
});

const Userdetail=mongoose.model("Userdetail",signupSchema);

module.exports=Userdetail;
