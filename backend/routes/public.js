const express = require("express");

module.exports = (pool) => {
  const router = express.Router();

  // 🏏 Home Page — Upcoming Series & Matches
  router.get("/home", async (req, res) => {
    try {
      // Get upcoming series (start date >= today)
      const [series] = await pool.query(`
        SELECT 
          s.series_id,
          s.name,
          s.format,
          s.type,
          s.start_date,
          s.end_date,
          s.host_country
        FROM series s
        WHERE s.start_date >= CURDATE()
        ORDER BY s.start_date ASC
        LIMIT 5
      `);

      // Get upcoming matches (date >= now)
      const [matches] = await pool.query(`
        SELECT 
          m.match_id,
          m.series_id,
          m.match_date,
          t1.name AS team1,
          t2.name AS team2,
          v.venue_name AS venue
        FROM \`match\` m
        JOIN teams t1 ON m.team1_id = t1.team_id
        JOIN teams t2 ON m.team2_id = t2.team_id
        LEFT JOIN venue v ON m.venue_id = v.venue_id
        WHERE m.match_date >= NOW()
        ORDER BY m.match_date ASC
        LIMIT 10
      `);

      res.json({ series, matches });
    } catch (err) {
      console.error("Error fetching home data:", err);
      res.status(500).json({ message: "Server error loading home data" });
    }
  });

  // 🕓 Recently Completed Matches (optional)
  router.get("/recent-matches", async (req, res) => {
    try {
      const [matches] = await pool.query(`
        SELECT 
          m.match_id,
          m.series_id,
          m.match_date,
          t1.team_name AS team1,
          t2.team_name AS team2,
          v.venue_name AS venue
        FROM \`match\` m
        JOIN teams t1 ON m.team1_id = t1.team_id
        JOIN teams t2 ON m.team2_id = t2.team_id
        LEFT JOIN venue v ON m.venue_id = v.venue_id
        WHERE m.match_date < NOW()
        ORDER BY m.match_date DESC
        LIMIT 10
      `);

      res.json({ matches });
    } catch (err) {
      console.error("Error fetching recent matches:", err);
      res.status(500).json({ message: "Server error loading recent matches" });
    }
  });

  return router;
};
