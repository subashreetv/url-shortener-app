import jsw from "jsonwebtoken";

export default async (req, res, next) => {
  const token = req.header("Authorization");

  if (!token) {
    return res.status(401).json({ message: "No token, authorization denied" });
  }

  try {
    let jwtToken = token.split(" ")[1];
    const decoded = jsw.verify(jwtToken, process.env.JWT_SECRET);
    req.user = decoded; // Attach user info to request
    next();
  } catch (error) {
    console.log("Error authenticating user:", error);
    
    res.status(401).json({ message: "Token is not valid" });
  }
};
