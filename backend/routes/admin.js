// backend/routes/admin.js
const express = require("express");
const verifyAdmin = require("../middleware/verifyAdmin");

module.exports = (pool) => {
  const router = express.Router();

  // All admin endpoints require verifyAdmin
  router.use(verifyAdmin);

  // Dashboard summary: series, teams, matches, employees, pending news
  router.get("/dashboard", async (req, res) => {
    try {
      const [series] = await pool.query("SELECT * FROM Series ORDER BY start_date DESC LIMIT 20");
      const [teams] = await pool.query("SELECT * FROM teams ORDER BY name LIMIT 50");
      const [matches] = await pool.query("SELECT * FROM `Match` ORDER BY match_id DESC LIMIT 20");
      const [employees] = await pool.query(
        `SELECT e.employee_id, u.user_id, u.name, u.email FROM Employee e 
         LEFT JOIN User u ON e.user_id = u.user_id LIMIT 50`
      );
      const [pendingNews] = await pool.query(
        "SELECT id, title, content, author_id, created_at FROM News WHERE status = 'pending' ORDER BY created_at DESC LIMIT 50"
      );
      res.json({ series, teams, matches, employees, pendingNews });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server error" });
    }
  });

  // ---- Series CRUD ----
  router.post("/series", async (req, res) => {
    try {
      const { name, format, type, start_date, end_date, host_country } = req.body;
      await pool.query(
        "INSERT INTO Series (name, format, type, start_date, end_date, host_country) VALUES (?, ?, ?, ?, ?, ?)",
        [name, format, type, start_date || null, end_date || null, host_country]
      );
      res.json({ message: "Series created" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server error" });
    }
  });

  router.put("/series/:id", async (req, res) => {
    try {
      const id = req.params.id;
      const { name, format, type, start_date, end_date, host_country } = req.body;
      await pool.query(
        "UPDATE Series SET name=?, format=?, type=?, start_date=?, end_date=?, host_country=? WHERE series_id = ?",
        [name, format, type, start_date || null, end_date || null, host_country, id]
      );
      res.json({ message: "Series updated" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server error" });
    }
  });

  router.delete("/series/:id", async (req, res) => {
    try {
      await pool.query("DELETE FROM Series WHERE series_id = ?", [req.params.id]);
      res.json({ message: "Series deleted" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server error" });
    }
  });

  // ---- Team CRUD ----
  router.post("/team", async (req, res) => {
    try {
      const { team_name, country, gender, logo_url, type } = req.body;
      await pool.query(
        "INSERT INTO Team (team_name, country, gender, logo_url, type) VALUES (?, ?, ?, ?, ?)",
        [team_name, country, gender, logo_url, type]
      );
      res.json({ message: "Team created" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server error" });
    }
  });

  router.put("/team/:id", async (req, res) => {
    try {
      const { team_name, country, gender, logo_url, type } = req.body;
      await pool.query(
        "UPDATE Team SET team_name=?, country=?, gender=?, logo_url=?, type=? WHERE team_id=?",
        [team_name, country, gender, logo_url, type, req.params.id]
      );
      res.json({ message: "Team updated" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server error" });
    }
  });

  // ---- Match CRUD ----
  router.post("/match", async (req, res) => {
    try {
      const { series_id, team1_id, team2_id, venue_id, match_date } = req.body;
      await pool.query(
        "INSERT INTO `Match` (series_id, team1_id, team2_id, venue_id) VALUES (?, ?, ?, ?)",
        [series_id || null, team1_id, team2_id, venue_id || null]
      );
      // Optionally insert a match_date field if schema supports it
      res.json({ message: "Match created" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server error" });
    }
  });

  router.put("/match/:id", async (req, res) => {
    try {
      const { series_id, team1_id, team2_id, venue_id, winner_team_id } = req.body;
      await pool.query(
        "UPDATE `Match` SET series_id=?, team1_id=?, team2_id=?, venue_id=?, winner_team_id=? WHERE match_id=?",
        [series_id || null, team1_id, team2_id, venue_id || null, winner_team_id || null, req.params.id]
      );
      res.json({ message: "Match updated" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server error" });
    }
  });

  // ---- Assign employee to a target (match/series/team/player/ranking) ----
  router.post("/assign", async (req, res) => {
    try {
      const { employee_id, target_type, target_id, role } = req.body;
      await pool.query(
        "INSERT INTO employee_assignments (employee_id, target_type, target_id, role) VALUES (?, ?, ?, ?)",
        [employee_id, target_type, target_id, role || null]
      );
      res.json({ message: "Employee assigned" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server error" });
    }
  });

  // ---- News approval ----
  router.get("/pending-news", async (req, res) => {
    try {
      const [rows] = await pool.query("SELECT news_id, title, content, author_id, created_at FROM News WHERE status='pending' ORDER BY created_at DESC");
      res.json(rows);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server error" });
    }
  });

  router.post("/news/:id/approve", async (req, res) => {
    try {
      const newsId = req.params.id;
      const adminId = req.user.id;
      await pool.query(
        "UPDATE News SET status='approved', approved_by=?, approved_at=NOW(), reject_reason=NULL WHERE news_id=?",
        [adminId, newsId]
      );
      res.json({ message: "News approved" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server error" });
    }
  });

  router.post("/news/:id/reject", async (req, res) => {
    try {
      const newsId = req.params.id;
      const { reason } = req.body;
      const adminId = req.user.id;
      await pool.query(
        "UPDATE News SET status='rejected', approved_by=?, approved_at=NOW(), reject_reason=? WHERE news_id=?",
        [adminId, reason || null, newsId]
      );
      res.json({ message: "News rejected" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server error" });
    }
  });

  // ---- List employees (for assignments UI) ----
  router.get("/employees", async (req, res) => {
    try {
      const [rows] = await pool.query(
        `SELECT e.employee_id, u.user_id, u.name, u.email
         FROM Employee e
         LEFT JOIN User u ON e.user_id = u.user_id`
      );
      res.json(rows);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server error" });
    }
  });

  return router;
};
