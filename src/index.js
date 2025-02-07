import dotenv from "dotenv"
import express, { json } from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import { serve, setup } from "swagger-ui-express";
import connectDB from "../config/db.js";
import client from "../config/redis.js";
import authRoutes from "../routes/authRoutes.js";
import urlRoutes from "../routes/urlRoutes.js";
import analyticsRoutes from "../routes/analyticsRoutes.js";
import {swagger} from "../config/swagger.js"
const app = express();

dotenv.config()
// Connect to MongoDB
connectDB();

// Connect to Redis
client.connect().catch(console.error);

// Middleware
app.use(cors());
app.use(helmet()); // Security headers
app.use(json()); // JSON request body parsing

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 50, // Limit each IP to 100 requests per windowMs
    message: "Too many requests, please try again later."
});
app.use(limiter);

// Routes
app.use("/auth", authRoutes);
app.use("/api", urlRoutes);
app.use("/api", analyticsRoutes);

// API Documentation (Swagger)
app.use("/docs", serve, setup(swagger));

// Default route
app.get("/", (req, res) => {
    res.json({ message: "Welcome to the Custom URL Shortener API!" });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: "Something went wrong!" });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

export default app;