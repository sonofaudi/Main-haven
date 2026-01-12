import jwt from "jsonwebtoken";
import user from "../models/User.js";

export async function redirectIfLoggedIn(req, res, next) {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return next(); // no token → continue

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userExists = await user.findById(decoded.id);
    if (userExists) return res.redirect("/homepage.html");
    next();
  } catch {
    next();
  }
}

async function authMiddleware(req, res, next) {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
        return res.status(401).json({ messgae: "Not logged in"})
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        req.user = await user.findById(decoded.id);
        next();
    } catch (err) {
        res.status(401).json({ message: "Invalid token"})
    }
}

export default authMiddleware
