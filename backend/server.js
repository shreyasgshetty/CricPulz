const express = require("express");
const mysql = require("mysql2/promise"); // promise version
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

// Create MySQL pool **first**
const pool = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASS || "mypassword",
  database: process.env.DB_NAME || "cricpulz"
});

// Then pass pool to auth routes
const authRoutes = require("./routes/auth")(pool);
app.use("/api/auth", authRoutes);

const adminRoutes = require("./routes/admin")(pool);
app.use("/api/admin", adminRoutes);
const cricketRoutes = require("./routes/cricket"); // adjust path if needed
app.use("/api/cricket", cricketRoutes);

app.get("/", (req, res) => res.send("API Running..."));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
