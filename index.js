const express = require("express");
const signupdetails = require("./models/signup");
const swaggerJsdoc = require("swagger-jsdoc")
const swaggerUi = require("swagger-ui-express");
const mongoose=require("mongoose");
const nodemailer = require('nodemailer');
const app = express();
const cors = require("cors");
const otpdetails=require("./models/Otp");

const {
  
  solve,
  print2DArray,
  copyGrid,
  createPuzzle,
 
} =require("./Sudoko");
// middleware
app.use(express.json());
app.use(cors());
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, PUT, POST");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});
main()
.then(()=>{
    console.log("connection successful");
})
.catch((err)=>{
 console.log(err);
})

async function main(){
   await  mongoose.connect('mongodb+srv://saigannu08:Sony24%40@cluster3.dlpz51e.mongodb.net/');
}

//signup page backend
app.post("/auth/signup",async(req,res)=>{
  const name=req.body.name;
  const email=req.body.email;
  const username=req.body.username;
  const password=req.body.password;

let user1=new signupdetails({
  name:name,
  email:email,
  username:username,
  password:password,
});
await user1.save()
.then(()=>{
  res.send("signup was successful");
})
.catch((err)=>{
  res.send(err);
})
});

//login page backend
app.post("/auth/login",async (req,res)=>{
  const email=req.body.email;
  const password=req.body.password;
const present=await signupdetails.findOne({email:email,password:password});
if(present){
  res.send("login sucess");
}else{
  return res.status(400).json({ error: 'Email or wrong password' });
}

});

//forgotpassword page backend

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: 'abhijithsai24910@gmail.com',
    pass: 'welt emaw rsll ghcj',
  },
});

//forgotpassword

app.post("/auth/forgotpassword",async(req,res)=>{
  const email=req.body.email;
try{
 
    const otp = Math.floor(100000 + Math.random() * 900000);;
    const expirationTime = new Date(Date.now() + 5 * 1000); 
    const user = await signupdetails.findOne(
      { email:email }
    );
    console.log(signupdetails.findOne());
    if(!user){
      return res.status(404).json({error:'User not found'});
    }
 let user1=new otpdetails({
  email:email,
  otp:otp,
  expireAfterSeconds:600
 })
  await user1.save();
    const mailOptions = {
      from: 'abhijithsai24910@gmail.com',
      to: email,
      subject: 'Forgot Password OTP',
      text: `Your OTP for resetting the password is: ${otp}`,
    };
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error(error);
        return res.status(305).json({ error: 'Error sending OTP' });
      }
      console.log('OTP sent: ' + info.response);
      res.status(200).json({ message: 'OTP sent successfully' });
    });
  }catch (error) {
    console.error(error);
    res.status(501).json({ error: 'Internal server error' });
  }
  
})

// otp verfication
app.post("/auth/otpverfication",async(req,res)=>{
  const email=req.body.email;
  const otp=req.body.otp;
  const user=otpdetails.findOne({email:email,otp:otp});
  if(user){
     res.send("OTP verfication Successful");
  }else{
      return res.status(401).json({error:'Email or otp are incorrect'});
  }
  return res.status(500).json({error:'Internal server error'});
})

//change password
app.post("/auth/changepassword",async(req,res)=>{
  const email=req.body.email;
  const password=req.body.password;
  try{
  const user=  await signupdetails.findOneAndUpdate({email:email},{$set:{password:password}},{new: true });
  if(user){
  
   return res.send("Password changed Successfully");
 }else{
     return res.status(401).json({error:'User not found'});
 }
}catch(err){
  return res.status(500).json({error:'Internal server error'});
}
})
//get all users
app.get("/users",async(req,res)=>{
  try {
  
    const users = await signupdetails.find();
   
    const usersJSON = JSON.stringify(users);
 
    res.send(users);
} catch (error) {
    res.status(500).json({ message: 'Error fetching users', error: error.message });
}
})
// to get sudoko
app.get("/newsudoko",async(req,res)=>{
  try{
  let puzzle = await createPuzzle();
  return res.status(200).send({game:puzzle});
  }catch(err){
    return res.send("Internal error");
  }
})
//solve sudoko
app.post("/solvesudoko",(req,res)=>{
  try{
  let  puzzle=[];
  copyGrid(req.body.game,puzzle);
  solve(puzzle);
  return res.status(200).send({game:puzzle});
  }catch(err){
    console.log(req.body.game);
    return res.status(300).send(err);
  }
})
//save to do later
app.post("/:username/todo",async(req,res)=>{
  try{
  const username=req.params.username;
  let puzzle=[];
  copyGrid(req.body.game,puzzle);
  console.log(puzzle);
  let userBoard = await signupdetails.findOne({ username });
  if (!userBoard) {
    userBoard = new signupdetails({ username, puzzles: [] });
  }
  userBoard.puzzles.push({ board: puzzle });

  // Save the updated user board record
  await userBoard.save();
  res.status(200).json({ message: 'Sudoku board saved successfully.' });
} catch (error) {
  console.error(error);
  res.status(500).json({ error: 'Internal server error.' });
}
})

// solved puzzles
app.post('/sudoku/:username/solved', async (req, res) => {
  try {
    const { username } = req.params;
    const timeTaken  = req.body.timeTaken; // Assuming board is a 2D array and timeTaken is formatted as HH:MM:SS
    let puzzle=[];
    copyGrid(req.body.game,puzzle);
    // Find the user's Sudoku board record or create a new one if not exists
    let userBoard = await signupdetails.findOne({ username:username });

    if (!userBoard) {
      userBoard = new signupdetails({ username, solvedBoards: [] });
    }
console.log(puzzle);
    // Push the solved board with time taken into the user's solvedBoards array
    userBoard.solvedBoards.push( {board:puzzle,timeTaken:timeTaken} );

    // Save the updated user board record
    await userBoard.save();

    res.status(200).json({ message: 'Sudoku board with time taken saved successfully.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error.' });
  }
});
//get a specific user
app.get('/:username/details',async(req,res)=>{
 
  try{
    const {username}=req.params;
    const user1=await signupdetails.findOne({username:username});
   

    res.send(user1);
  }catch(err){
    res.status(500).send("unable to fetch the user")
  }
})


const port = 3000
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

/*let puzzle = createPuzzle();
print2DArray(puzzle);
solve(puzzle);
print2DArray(puzzle);*/
