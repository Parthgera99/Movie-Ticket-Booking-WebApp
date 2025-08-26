import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
  const token = req.cookies.accessToken; // ✅ read from cookie
  if (!token) return res.status(401).json({ message: "No token provided" });
  console.log(token);
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log(decoded);
    req.user = decoded; // attach user info
    next();
  } catch (err) {
    return res.status(403).json({ message: "Invalid token" });
  }
};
