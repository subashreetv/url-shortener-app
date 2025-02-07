import user from "../models/user.js";
import jwt from "jsonwebtoken";
import axios from "axios";

export async function createGoogleAuthUrl(req, res) {
    const redirectUri = process.env.ENVIRONMENT == "production" ? "https://url-shortener-app-2b7v.onrender.com/auth/google/callback" : "http://localhost:5000/auth/google/callback";
    const googleAuthURL = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${process.env.GOOGLE_CLIENT_ID}&redirect_uri=${redirectUri}&response_type=code&scope=email`;
    res.json({ message: "Google auth url generated successfully", googleAuthURL  });
    // res.redirect(googleAuthURL);
}

export async function googleAuthCallback(req, res) {
    const { code } = req.query;
    
    if (!code) {
      return res.status(400).json({ error: "Authorization code not provided!" });
    }
  
    try {
      // Step 3: Exchange Authorization Code for Access Token
      const redirectUri = process.env.ENVIRONMENT == "production" ? "https://url-shortener-app-2b7v.onrender.com/auth/google/callback" : "http://localhost:5000/auth/google/callback";
      const tokenResponse = await axios.post("https://oauth2.googleapis.com/token", null, {
        params: {
          client_id: process.env.GOOGLE_CLIENT_ID,
          client_secret: process.env.GOOGLE_CLIENT_SECRET,
          code,
          grant_type: "authorization_code",
          redirect_uri: redirectUri,
        },
      });
  
      const { access_token, id_token } = tokenResponse.data;
      // Step 4: Verify the ID Token and Get User Info
      const userInfo = await axios.get(`https://www.googleapis.com/oauth2/v3/userinfo`, {
        headers: { Authorization: `Bearer ${access_token}` },
      });

      const userData = {
        googleId: userInfo.data.sub,
        name: userInfo.data.name,
        email: userInfo.data.email,
        picture: userInfo.data.picture,
      };

        const userExists = await user.findOne({googleId: userInfo.data.sub });
        if (!userExists){
            let newUser = new user({googleId: userInfo.data.sub, email: userInfo.data.email});
            await newUser.save();  
        } 

      // Step 5: Generate JWT for the User
      const jwtToken = jwt.sign(userData, process.env.JWT_SECRET, { expiresIn: "1h" });
  
      res.json({ message: "User authenticated successfully", userData, jwtToken });
    } catch (error) {
      console.error("Error during Google authentication:", error.response?.data || error.message);
      res.status(500).json({ error: "Authentication failed" });
    }
}
