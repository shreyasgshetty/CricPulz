// backend/middleware/verifyAdmin.js
const jwt = require("jsonwebtoken");

function verifyAdmin(req, res, next) {
  try {
    const auth = req.headers["authorization"];
    if (!auth) return res.status(401).json({ message: "No token provided" });

    const token = auth.split(" ")[1];
    if (!token) return res.status(401).json({ message: "Invalid token format" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // If you set role on login token:
    if (decoded.role && decoded.role === "admin") {
      req.user = decoded;
      return next();
    }
    // If no role claim, deny (or optionally check DB)
    return res.status(403).json({ message: "Access denied. Admins only." });
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
}

module.exports = verifyAdmin;
