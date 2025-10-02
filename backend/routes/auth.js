const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

module.exports = (pool) => {
  const router = express.Router();

  // REGISTER
  router.post("/register", async (req, res) => {
    try {
      const { name, email, password } = req.body;
      const hashedPassword = await bcrypt.hash(password, 10);

      await pool.query(
        "INSERT INTO User (name, email, password) VALUES (?, ?, ?)",
        [name, email, hashedPassword]
      );

      res.status(201).json({ message: "User registered!" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server error" });
    }
  });

  // LOGIN
  router.post("/login", async (req, res) => {
    try {
      const { email, password } = req.body;
      const [rows] = await pool.query("SELECT * FROM User WHERE email = ?", [email]);

      if (rows.length === 0) return res.status(400).json({ message: "User not found" });

      const user = rows[0];
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) return res.status(400).json({ message: "Invalid password" });

      const token = jwt.sign({ id: user.user_id }, process.env.JWT_SECRET, { expiresIn: "1h" });
      res.json({ message: "Login successful", token });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server error" });
    }
  });

  // ADMIN LOGIN
router.post("/admin-login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // check user
    const [rows] = await pool.query("SELECT * FROM User WHERE email = ?", [email]);
    if (rows.length === 0) return res.status(400).json({ message: "User not found" });

    const user = rows[0];
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid password" });

    // check if user is an admin
    const [admins] = await pool.query("SELECT * FROM admin WHERE user_id = ?", [user.user_id]);
    if (admins.length === 0) return res.status(403).json({ message: "Not an admin" });

    // generate token
    const token = jwt.sign({ id: user.user_id, role: "admin" }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.json({ message: "Admin login successful", token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// EMPLOYEE LOGIN
router.post("/employee-login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // find user by email
    const [rows] = await pool.query("SELECT * FROM user WHERE email = ?", [email]);
    if (rows.length === 0) return res.status(400).json({ message: "User not found" });

    const user = rows[0];

    // check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid password" });

    // check if user is an employee
    const [employees] = await pool.query("SELECT * FROM employee WHERE user_id = ?", [user.user_id]);
    if (employees.length === 0) return res.status(403).json({ message: "Not an employee" });

    // generate JWT
    const token = jwt.sign({ id: user.user_id, role: "employee" }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.json({ message: "Employee login successful", token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});


  return router;
};
