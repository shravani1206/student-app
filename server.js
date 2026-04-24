const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB
mongoose.connect("mongodb://127.0.0.1:27017/studentDB")
.then(()=>console.log("MongoDB Connected"))
.catch(err=>console.log(err));

// Schema
const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String
});

const User = mongoose.model("User", userSchema);

// REGISTER
app.post("/register", async (req,res)=>{
  const user = new User(req.body);
  await user.save();
  res.json({message:"Registered"});
});

// LOGIN
app.post("/login", async (req,res)=>{
  const {email,password} = req.body;
  const user = await User.findOne({email,password});

  if(user){
    res.json({success:true,user});
  } else {
    res.json({success:false});
  }
});

// GET USERS
app.get("/users", async (req,res)=>{
  const users = await User.find();
  res.json(users);
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});