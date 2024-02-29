import express, { Request, Response } from "express";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import Joi from "joi";
import morgan from "morgan";
import dotenv from "dotenv";
import { swaggerSpec } from "./swagger";
import swaggerUi from "swagger-ui-express";
import path from "path";
import bodyParser from "body-parser";

dotenv.config();
const app = express();
export default app;
const PORT = process.env.PORT || 3000;

// Mongoose connection
mongoose
  .connect(process.env.MONGODB_URI!, {})
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Error connecting to MongoDB:", err));

// Define schemas
const userSchema = new mongoose.Schema({
  email: { type: String, required: true },
  password: { type: String, required: true },
});

const likeSchema = new mongoose.Schema({
  userEmail: { type: String, required: true },
});

const dislikeSchema = new mongoose.Schema({
  userEmail: { type: String, required: true },
});

const commentSchema = new mongoose.Schema({
  userEmail: { type: String, required: true },
  comment: { type: String, required: true },
});

const contactSchema = new mongoose.Schema({
  fullname: { type: String, required: true },
  email: { type: String, required: true },
  message: { type: String, required: true },
});

// Define models
const User = mongoose.model("User", userSchema);
const Like = mongoose.model("Like", likeSchema);
const Dislike = mongoose.model("Dislike", dislikeSchema);
const Comment = mongoose.model("Comment", commentSchema);
const Contact = mongoose.model("Contact", contactSchema);

// Middleware
app.use(express.json());
app.use(morgan("dev"));
app.use(express.static("public"));
app.use(bodyParser.json({ limit: "10mb" }));
app.use(bodyParser.urlencoded({ limit: "10mb", extended: true }));

// Serve Swagger UI
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Signup endpoint
app.post("/api/signup", async (req, res) => {
  // Validate request body
  const { error } = userSignupSchema(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });

  // Hash password
  const hashedPassword = await bcrypt.hash(req.body.password, 10);

  // Create new user
  const user = new User({
    email: req.body.email,
    password: hashedPassword,
  });

  try {
    // Save user to database
    await user.save();
    res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Login endpoint
app.post("/api/login", async (req, res) => {
  // Validate request body
  const { error } = userLoginSchema(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });

  // Find user by email
  const user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(401).json({ error: "Invalid credentials" });

  // Compare passwords
  const validPassword = await bcrypt.compare(req.body.password, user.password);
  if (!validPassword)
    return res.status(401).json({ error: "Invalid credentials" });

  // Generate JWT token
  const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET!, {
    expiresIn: "1h",
  });

  res.status(200).json({ token });
});

// Define RequestWithUser interface
interface RequestWithUser extends Request {
  user: { userId: string };
}

// Like endpoint
app.post("/api/like", async (req: any, res: any) => {
  // Validate request body
  const { error } = likeValidationSchema.validate(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });

  // Save like to database
  const like = new Like({
    userEmail: req.user.userId,
  });

  try {
    await like.save();
    res.status(200).json({ message: "Like saved successfully" });
  } catch (error) {
    console.error("Error saving like:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Define a Joi schema for like validation
const likeValidationSchema = Joi.object({
  userEmail: Joi.string().email().required(),
});

// Dislike endpoint
app.post("/api/dislike", async (req: any, res: any) => {
  // Validate request body
  const { error } = dislikeValidationSchema.validate(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });

  // Save dislike to database
  const dislike = new Dislike({
    userEmail: req.user.userId, // Assuming you store user ID in req.user
  });

  try {
    await dislike.save();
    res.status(200).json({ message: "Dislike saved successfully" });
  } catch (error) {
    console.error("Error saving dislike:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Define a Joi schema for dislike validation
const dislikeValidationSchema = Joi.object({
  userEmail: Joi.string().email().required(),
});

// Comment endpoint
app.post("/api/comment", async (req: any, res: any) => {
  // Validate request body
  const { error } = commentValidationSchema.validate(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });

  // Save comment to database
  const comment = new Comment({
    userEmail: req.user.userId,
    comment: req.body.comment,
  });

  try {
    await comment.save();
    res.status(200).json({ message: "Comment saved successfully" });
  } catch (error) {
    console.error("Error saving comment:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Define a Joi schema for comment validation
const commentValidationSchema = Joi.object({
  userEmail: Joi.string().email().required(),
  comment: Joi.string().required(),
});

// Contact form endpoint
app.post("/api/contact", async (req, res) => {
  // Validate request body
  const { error } = contactValidationSchema.validate(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });

  // Save contact form message to database
  const contact = new Contact({
    fullname: req.body.fullname,
    email: req.body.email,
    message: req.body.message,
  });

  try {
    await contact.save();
    res.status(200).json({ message: "Message sent successfully" });
  } catch (error) {
    console.error("Error saving contact form message:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Define a Joi schema for contact form validation
const contactValidationSchema = Joi.object({
  fullname: Joi.string().required(),
  email: Joi.string().email().required(),
  message: Joi.string().required(),
});

// Save contact form message to database

// Assuming this is within an Express route handler
app.post("/api/contact", async (req: Request, res: Response) => {
  try {
    const contact = new Contact({
      fullname: req.body.fullname,
      email: req.body.email,
      message: req.body.message,
    });

    await contact.save();
    res.status(200).json({ message: "Message sent successfully" });
  } catch (error) {
    console.error("Error saving contact form message:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Middleware function to authenticate token
function authenticateToken(
  req: RequestWithUser,
  res: Response,
  next: express.NextFunction
) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (token == null) return res.sendStatus(401);

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET!, (err: any, user: any) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}

// Define RequestWithUser interface
interface RequestWithUser extends Request {
  user: { userId: string };
}

// Signup schema validation function
function userSignupSchema(body: any) {
  const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
  });
  return schema.validate(body);
}

// Login schema validation function
function userLoginSchema(body: any) {
  const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
  });
  return schema.validate(body);
}

// Contact form schema validation function
function contactFormSchema(body: any) {
  const schema = Joi.object({
    fullname: Joi.string().required(),
    email: Joi.string().email().required(),
    message: Joi.string().required(),
  });
  return schema.validate(body);
}

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${5500}`);
});
