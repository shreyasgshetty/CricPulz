// backend/routes/admin.js
const express = require("express");
const verifyAdmin = require("../middleware/verifyAdmin");

module.exports = (pool) => {
  const router = express.Router();

  // All admin endpoints require verifyAdmin
  router.use(verifyAdmin);

  // ================= DASHBOARD =================
  router.get("/dashboard", async (req, res) => {
    try {
      const [series] = await pool.query("SELECT * FROM series ORDER BY start_date DESC LIMIT 20");
      const [teams] = await pool.query("SELECT * FROM teams ORDER BY name LIMIT 50");
      const [matches] = await pool.query("SELECT * FROM `match` ORDER BY match_id DESC LIMIT 20");
      const [employees] = await pool.query(`
        SELECT e.employee_id, u.user_id, u.name, u.email 
        FROM employee e 
        LEFT JOIN user u ON e.user_id = u.user_id 
        LIMIT 50
      `);
      const [pendingNews] = await pool.query(`
        SELECT id, title, content, author_id, created_at 
        FROM news 
        WHERE status = 'pending' 
        ORDER BY created_at DESC 
        LIMIT 50
      `);

      res.json({ series, teams, matches, employees, pendingNews });
    } catch (err) {
      console.error("Dashboard error:", err);
      res.status(500).json({ message: "Server error" });
    }
  });

  // ================= SERIES CRUD =================
  router.post("/series", async (req, res) => {
    try {
      const { name, format, type, start_date, end_date, host_country } = req.body;
      await pool.query(
        "INSERT INTO series (name, format, type, start_date, end_date, host_country) VALUES (?, ?, ?, ?, ?, ?)",
        [name, format, type, start_date || null, end_date || null, host_country]
      );
      res.json({ message: "Series created" });
    } catch (err) {
      console.error("Create series error:", err);
      res.status(500).json({ message: "Server error" });
    }
  });

  router.put("/series/:id", async (req, res) => {
    try {
      const id = req.params.id;
      const { name, format, type, start_date, end_date, host_country } = req.body;
      await pool.query(
        "UPDATE series SET name=?, format=?, type=?, start_date=?, end_date=?, host_country=? WHERE series_id=?",
        [name, format, type, start_date || null, end_date || null, host_country, id]
      );
      res.json({ message: "Series updated" });
    } catch (err) {
      console.error("Update series error:", err);
      res.status(500).json({ message: "Server error" });
    }
  });

  router.delete("/series/:id", async (req, res) => {
    try {
      await pool.query("DELETE FROM series WHERE series_id=?", [req.params.id]);
      res.json({ message: "Series deleted" });
    } catch (err) {
      console.error("Delete series error:", err);
      res.status(500).json({ message: "Server error" });
    }
  });

  // ================= TEAM CRUD =================
router.post("/team", async (req, res) => {
  try {
    const { team_name, country, gender, logo_url, type } = req.body;
    const name = team_name; // normalize field

    if (!name || !country || !gender || !type) {
      return res.status(400).json({ message: "All fields are required" });
    }

    await pool.query(
      "INSERT INTO teams (name, country, gender, logo_url, type) VALUES (?, ?, ?, ?, ?)",
      [name, country, gender, logo_url || "", type]
    );

    res.json({ message: "Team created" });
  } catch (err) {
    console.error("Create team error:", err);
    res.status(500).json({ message: "Server error" });
  }
});


  router.put("/team/:id", async (req, res) => {
    try {
      const { name, country, gender, logo_url, type } = req.body;
      await pool.query(
        "UPDATE teams SET name=?, country=?, gender=?, logo_url=?, type=? WHERE team_id=?",
        [name, country, gender, logo_url || "", type, req.params.id]
      );
      res.json({ message: "Team updated" });
    } catch (err) {
      console.error("Update team error:", err);
      res.status(500).json({ message: "Server error" });
    }
  });

  // ================= MATCH CRUD =================
  router.post("/match", async (req, res) => {
    try {
      const { series_id, team1_id, team2_id, venue_id, match_date } = req.body;

      if (!team1_id || !team2_id) {
        return res.status(400).json({ message: "Both teams must be selected" });
      }

      await pool.query(
        "INSERT INTO `match` (series_id, team1_id, team2_id, venue_id, match_date) VALUES (?, ?, ?, ?, ?)",
        [series_id || null, team1_id, team2_id, venue_id || null, match_date || null]
      );

      res.json({ message: "Match created" });
    } catch (err) {
      console.error("Create match error:", err);
      res.status(500).json({ message: "Server error" });
    }
  });

  router.put("/match/:id", async (req, res) => {
    try {
      const { series_id, team1_id, team2_id, venue_id, winner_team_id } = req.body;
      await pool.query(
        "UPDATE `match` SET series_id=?, team1_id=?, team2_id=?, venue_id=?, winner_team_id=? WHERE match_id=?",
        [series_id || null, team1_id, team2_id, venue_id || null, winner_team_id || null, req.params.id]
      );
      res.json({ message: "Match updated" });
    } catch (err) {
      console.error("Update match error:", err);
      res.status(500).json({ message: "Server error" });
    }
  });

  // ================= ASSIGN EMPLOYEE =================
router.post("/assign", async (req, res) => {
  try {
    const { employee_id, target_type, target_id, role } = req.body;
    console.log("🟩 Assign Request Data:", req.body);

    await pool.query(
      "INSERT INTO employee_assignments (employee_id, target_type, target_id, role) VALUES (?, ?, ?, ?)",
      [employee_id, target_type, target_id, role || null]
    );

    res.json({ message: "Employee assigned" });
  } catch (err) {
    console.error("Assign employee error:", err);
    res.status(500).json({ message: "Server error" });
  }
});


  // ================= NEWS APPROVAL =================
  router.get("/pending-news", async (req, res) => {
    try {
      const [rows] = await pool.query(`
        SELECT id, title, content, author_id, created_at 
        FROM news 
        WHERE status='pending' 
        ORDER BY created_at DESC
      `);
      res.json(rows);
    } catch (err) {
      console.error("Fetch pending news error:", err);
      res.status(500).json({ message: "Server error" });
    }
  });

  router.post("/news/:id/approve", async (req, res) => {
    try {
      const newsId = req.params.id;
      const adminId = req.user.id;
      await pool.query(
        "UPDATE news SET status='approved', approved_by=?, approved_at=NOW(), reject_reason=NULL WHERE id=?",
        [adminId, newsId]
      );
      res.json({ message: "News approved" });
    } catch (err) {
      console.error("Approve news error:", err);
      res.status(500).json({ message: "Server error" });
    }
  });

  router.post("/news/:id/reject", async (req, res) => {
    try {
      const newsId = req.params.id;
      const { reason } = req.body;
      const adminId = req.user.id;
      await pool.query(
        "UPDATE news SET status='rejected', approved_by=?, approved_at=NOW(), reject_reason=? WHERE id=?",
        [adminId, reason || null, newsId]
      );
      res.json({ message: "News rejected" });
    } catch (err) {
      console.error("Reject news error:", err);
      res.status(500).json({ message: "Server error" });
    }
  });

  // ================= EMPLOYEES LIST =================
  router.get("/employees", async (req, res) => {
    try {
      const [rows] = await pool.query(`
        SELECT e.employee_id, u.user_id, u.name, u.email
        FROM employee e
        LEFT JOIN user u ON e.user_id = u.user_id
      `);
      res.json(rows);
    } catch (err) {
      console.error("Fetch employees error:", err);
      res.status(500).json({ message: "Server error" });
    }
  });

  // ================= TOURNAMENT CRUD =================
  router.get("/tournaments", async (req, res) => {
    try {
      const [rows] = await pool.query("SELECT * FROM tournaments ORDER BY start_date DESC");
      res.json(rows);
    } catch (err) {
      console.error("Fetch tournaments error:", err);
      res.status(500).json({ message: "Server error" });
    }
  });

  router.post("/tournaments", async (req, res) => {
    try {
      const { name, type, start_date, end_date, host_country } = req.body;
      await pool.query(
        "INSERT INTO tournaments (name, type, start_date, end_date, host_country) VALUES (?, ?, ?, ?, ?)",
        [name, type, start_date || null, end_date || null, host_country]
      );
      res.json({ message: "Tournament created successfully" });
    } catch (err) {
      console.error("Create tournament error:", err);
      res.status(500).json({ message: "Server error" });
    }
  });

  router.put("/tournaments/:id", async (req, res) => {
    try {
      const { name, type, start_date, end_date, host_country } = req.body;
      await pool.query(
        "UPDATE tournaments SET name=?, type=?, start_date=?, end_date=?, host_country=? WHERE tournament_id=?",
        [name, type, start_date || null, end_date || null, host_country, req.params.id]
      );
      res.json({ message: "Tournament updated successfully" });
    } catch (err) {
      console.error("Update tournament error:", err);
      res.status(500).json({ message: "Server error" });
    }
  });

  router.delete("/tournaments/:id", async (req, res) => {
    try {
      await pool.query("DELETE FROM tournaments WHERE tournament_id=?", [req.params.id]);
      res.json({ message: "Tournament deleted successfully" });
    } catch (err) {
      console.error("Delete tournament error:", err);
      res.status(500).json({ message: "Server error" });
    }
  });

  return router;
};
