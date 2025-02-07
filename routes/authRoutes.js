
import express from "express";
import dotenv from "dotenv";
import { googleAuthCallback, createGoogleAuthUrl } from "../controllers/authController.js";

dotenv.config();
const router = express.Router();

// Google Auth Route
router.get( "/google", createGoogleAuthUrl );
  

// Google OAuth Callback
router.get( "/google/callback", googleAuthCallback );

export default router;
