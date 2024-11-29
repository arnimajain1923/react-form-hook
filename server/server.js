const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const app = express();

// CORS Configuration
app.use(
  cors({
    origin: "http://localhost:5173", // Replace with your React app's URL
    methods: ["GET", "POST", "PUT", "DELETE"], // Allowed HTTP methods
    credentials: true, // Allow cookies and credentials
  })
);
app.use(express.json());

// Connect to MongoDB
mongoose.connect("mongodb://localhost:27017/reactform");

// Create a schema and model
const UserSchema = new mongoose.Schema({
  username: String,
  email: String,
  password: String,
});
const User = mongoose.model("User", UserSchema);

// API endpoint to handle form submissions
app.post("/submit", async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const existingUser =  await User.find({ $or: [{ username : username }, { email : email }] });
    if (existingUser.length > 0) {
      res.status(500).send({ error: "User already exist" });
    } else {
      const newUser = new User({ username, email, password });
      await newUser.save();
      res.status(200).send({ message: "User saved successfully" });
    }
  } catch (err) {
    res.status(500).send({ error: "Error saving user" });
  }
});

// Start server
app.listen(5000, () => console.log("Server running on port 5000"));
