const express = require("express");
const jwt = require("jsonwebtoken");
const router = express.Router();

// ✅ Middleware to verify JWT token
function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // Bearer <token>

  // Or check cookie (if using cookies)
  const cookieToken = req.cookies?.token;
  const finalToken = token || cookieToken;

  if (!finalToken)
    return res.status(401).json({ message: "Access denied, token missing" });

  jwt.verify(finalToken, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: "Invalid or expired token" });
    req.user = user;
    next();
  });
}

module.exports = (pool) => {
  // ✅ Protected route
  router.get("/profile", authenticateToken, async (req, res) => {
    try {
      const [user] = await pool.query(
        "SELECT user_id, name, email FROM user WHERE user_id = ?",
        [req.user.id]
      );

      if (!user.length)
        return res.status(404).json({ message: "User not found" });

      res.json(user[0]);
    } catch (err) {
      console.error("Error fetching profile:", err);
      res.status(500).json({ message: "Error fetching user profile" });
    }
  });

  return router;
};
