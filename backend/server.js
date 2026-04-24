const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "../public")));
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/register.html"));
});


console.log("✅ BACKEND SERVER RUNNING");
// MongoDB
mongoose.connect("mongodb+srv://navaleshravani6_db_user:3hRYc5Cn8ZhHJ9BB@cluster0.e47sdei.mongodb.net/studentsdb")
.then(()=>console.log("MongoDB Connected"))
.catch(err=>console.log(err))

// Schema
const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String
});

mongoose.connection.on("error", err => {
  console.log("MongoDB Error:", err);
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
  try {
    const { email, password } = req.body;

    console.log("LOGIN REQUEST:", email, password); // debug

    const user = await User.findOne({ email, password });

    if(user){
      res.json({ success:true, user });
    } else {
      res.json({ success:false, message:"Invalid credentials" });
    }

  } catch(err) {
    console.log("LOGIN ERROR:", err);
    res.status(500).json({ success:false, message:"Server error" });
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