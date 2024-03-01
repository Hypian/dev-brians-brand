import express, { Request, Response, NextFunction } from "express";
import mongoose, { ConnectOptions } from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import Joi from "joi";
import morgan from "morgan";
import dotenv from "dotenv";
import bodyParser from "body-parser";

dotenv.config();
const app = express();
export default app;
const PORT = process.env.PORT || 3000;

// Mongoose connection
mongoose
  .connect("mongodb+srv://Hypian:Asad@123@atlascluster.z9xwgmj.mongodb.net/", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  } as ConnectOptions)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Error connecting to MongoDB:", err));

// Define schemas
const userSchema = new mongoose.Schema({
  email: { type: String, required: true },
  password: { type: String, required: true },
});

const blogSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  imageUrl: { type: String, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  comments: [{ type: String }],
  likes: { type: Number, default: 0 },
});

// Define schema for contact form
const contactSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  message: { type: String, required: true },
});

// Define models
const User = mongoose.model("User", userSchema);
const Blog = mongoose.model("Blog", blogSchema);
const Contact = mongoose.model("Contact", contactSchema);

// Middleware
app.use(express.json());
app.use(morgan("dev"));
app.use(bodyParser.json({ limit: "10mb" }));
app.use(bodyParser.urlencoded({ limit: "10mb", extended: true }));

// Contact form endpoint
app.post("/api/contact", async (req, res) => {
  try {
    // Validate request body
    const { error } = contactSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    // Process contact form data
    // Here you can implement your logic to handle the contact form submission,
    // such as sending an email, storing the message in the database, etc.

    res.status(200).json({ message: "Contact form submitted successfully" });
  } catch (error) {
    console.error("Error submitting contact form:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Signup endpoint
app.post("/api/signup", async (req, res) => {
  try {
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
  try {
    // Validate request body
    const { error } = userLoginSchema(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });

    // Find user by email
    const user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(401).json({ error: "Invalid credentials" });

    // Compare passwords
    const validPassword = await bcrypt.compare(
      req.body.password,
      user.password
    );
    if (!validPassword)
      return res.status(401).json({ error: "Invalid credentials" });

    // Generate JWT token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET!, {
      expiresIn: "1h",
    });

    res.status(200).json({ token });
  } catch (error) {
    console.error("Error logging in:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Blog post endpoint
app.post("/api/blog", authenticateToken, async (req, res) => {
  try {
    // Access user information from the request object
    const userId = req.user.userId;

    // Validate request body
    const { error } = blogSchemaValidation(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    // Create new blog post
    const blog = new Blog({
      title: req.body.title,
      content: req.body.content,
      imageUrl: req.body.imageUrl,
      userId: userId, // Associate the blog post with the user
    });

    // Save blog post to database
    await blog.save();
    res.status(201).json({ message: "Blog post created successfully" });
  } catch (error) {
    console.error("Error creating blog post:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Add comment to a blog post endpoint
app.post("/api/blog/:postId/comments", authenticateToken, async (req, res) => {
  try {
    // Access user information from the request object
    const userId = req.user.userId;

    // Get post ID from request parameters
    const postId = req.params.postId;

    // Validate request body
    const { error } = commentSchema(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    // Find blog post by ID
    const blogPost = await Blog.findById(postId);
    if (!blogPost)
      return res.status(404).json({ error: "Blog post not found" });

    // Add comment to the blog post
    blogPost.comments.push({
      userId: string,
      content: req.body.content,
    });

    // Save updated blog post
    await blogPost.save();

    res.status(200).json({ message: "Comment added successfully" });
  } catch (error) {
    console.error("Error adding comment:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Add like to a blog post endpoint
app.post("/api/blog/:postId/likes", authenticateToken, async (req, res) => {
  try {
    // Access user information from the request object
    const userId = req.user.userId;

    // Get post ID from request parameters
    const postId = req.params.postId;

    // Find blog post by ID
    const blogPost = await Blog.findById(postId);
    if (!blogPost)
      return res.status(404).json({ error: "Blog post not found" });

    // Check if user has already liked the post
    if (blogPost.likes.includes(userId)) {
      return res
        .status(400)
        .json({ error: "You have already liked this post" });
    }

    // Add user to the likes array
    blogPost.likes.push(userId);

    // Save updated blog post to database
    await blogPost.save();
    res.status(201).json({ message: "Like added successfully" });
  } catch (error) {
    console.error("Error adding like:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Middleware function to authenticate token
function authenticateToken(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (token == null) return res.sendStatus(401);

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET!, (err: any, user: any) => {
    if (err) return res.sendStatus(403);
    // Store the user information in a custom property of the request object
    req.user = user;
    // Call next middleware or route handler
    next();
  });
}

// Define Joi schema for user signup validation
function userSignupSchema(body: any) {
  const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
  });
  return schema.validate(body);
}

// Define Joi schema for user login validation
function userLoginSchema(body: any) {
  const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
  });
  return schema.validate(body);
}

// Define Joi schema for blog post validation
function blogSchemaValidation(body: any) {
  const schema = Joi.object({
    title: Joi.string().required(),
    content: Joi.string().required(),
    imageUrl: Joi.string().uri().required(),
  });
  return schema.validate(body);
}

// Define Joi schema for comment validation
function commentSchema(body: any) {
  const schema = Joi.object({
    comment: Joi.string().required(),
  });
  return schema.validate(body);
}

// Error handling middleware
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: "Internal server error" });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
