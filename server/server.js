import express, { json } from "express";
import mongoose from "mongoose";
import cors from "cors";
import Joi from "joi";
import {} from "mongoose";

const app = express();

// CORS Configuration
app.use(
  cors({
    origin: "http://localhost:5173", // Frontend URL
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);
app.use(express.json());

// Connect to MongoDB
mongoose
  .connect("mongodb://localhost:27017/reactform")
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Create a schema and model
const UserSchema = new mongoose.Schema({
  username: String,
  email: String,
  password: String,
});
const User = mongoose.model("User", UserSchema);

const validationSchema = Joi.object({
  username: Joi.string().min(3).max(20).required().messages({
    "string.empty": "Username is required",
    "string.min": "Username must be at least 3 characters",
    "string.max": "Username must not exceed 20 characters",
  }),
  email: Joi.string().email().required().messages({
    "string.empty": "Email is required",
    "string.email": "Email must be a valid format",
  }),
  password: Joi.string().min(8).required().messages({
    "string.empty": "Password is required",
    "string.min": "Password must be at least 8 characters",
  }),
});

// API endpoint to handle form submissions
app.post("/submit", async (req, res) => {
  try {
    // Validate request data using Joi
    const { error } = validationSchema.validate(req.body, { abortEarly: false });
    if (error) {
      const errorMessages = error.details.reduce((acc, curr) => {
        acc[curr.path[0]] = curr.message;
        return acc;
      }, {});
      return res.status(400).send({ errors: errorMessages });
    }

    const { username, email, password } = req.body;

    // Check if the user already exists
    const existingUser = await User.findOne({
      $or: [{ username: username }, { email: email }],
    });

    if (existingUser) {
      return res
        .status(400)
        .send({ error: "User already exists with this username or email" });
    }

    // Save the new user
    const newUser = new User({ username, email, password });
    await newUser.save();

    res.status(201).send({ message: "User saved successfully" });
  } catch (err) {
    console.error("Error saving user:", err);
    res.status(500).send({ error: "An error occurred while saving the user" });
  }
});

// Start the server
app.listen(5000, () => console.log("Server running on port 5000"));
