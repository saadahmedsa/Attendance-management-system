import dotenv from "dotenv";
dotenv.config();
import jwt from "jsonwebtoken";
import User from "../models/User.js";


export const authMiddleware = async (req, res, next) => {
  try {
    const token = req.cookies?.token; 
    
    if (!token) {
        return res.status(401).json({ success: false, message: "Unauthorized. No token provided." });
    }
    
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded) {
        return res.status(401).json({ success: false, message: "Not verified. No token provided." });
    }
    
    
    const user = await User.findById(decoded.id).select("password");
    if (!user) {
        return res.status(401).json({ success: false, message: "User not found." });
    }
    
    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ success: false, message: "Invalid or expired token." });
  }
};