import jwt from "jsonwebtoken";

// 🔐 Verify token
export const auth = (req, res, next) => {
  let token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ msg: "No token" });
  }

  // ✅ Handle Bearer token
  if (token.startsWith("Bearer ")) {
    token = token.split(" ")[1];
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;

    console.log("Decoded user:", decoded); // 🔥 debug

    next();
  } catch (err) {
    console.log("JWT Error:", err.message);
    res.status(401).json({ msg: "Invalid token" });
  }
};

// 👨‍💼 Admin only
export const adminOnly = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ msg: "Admin only" });
  }
  next();
};