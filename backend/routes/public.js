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

      // Get upcoming matches (date >= now) with team logos
      const [matches] = await pool.query(`
        SELECT 
          m.match_id,
          m.series_id,
          m.match_date,
          t1.name AS team1,
          t2.name AS team2,
          t1.logo_url AS team1_logo,
          t2.logo_url AS team2_logo,
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
          t1.name AS team1,
          t2.name AS team2,
          t1.logo_url AS team1_logo,
          t2.logo_url AS team2_logo,
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

  // 🏏 Series Page — Ongoing, Upcoming, and Completed Series
router.get("/series", async (req, res) => {
  try {
    const [ongoing] = await pool.query(`
      SELECT 
        series_id, name, format, type, start_date, end_date, host_country
      FROM series
      WHERE CURDATE() BETWEEN DATE(start_date) AND DATE(end_date)
      ORDER BY start_date ASC
    `);

    const [upcoming] = await pool.query(`
      SELECT 
        series_id, name, format, type, start_date, end_date, host_country
      FROM series
      WHERE start_date > CURDATE()
      ORDER BY start_date ASC
    `);

    const [completed] = await pool.query(`
      SELECT 
        series_id, name, format, type, start_date, end_date, host_country
      FROM series
      WHERE end_date < CURDATE()
      ORDER BY end_date DESC
    `);

    res.json({ ongoing, upcoming, completed });
  } catch (err) {
    console.error("Error fetching series list:", err);
    res.status(500).json({ message: "Server error fetching series list" });
  }
});

// 🏏 Series Details — Get series info + matches
router.get("/series/:id", async (req, res) => {
  try {
    const { id } = req.params;

    // Get series details
    const [seriesRows] = await pool.query(
      `
      SELECT 
        s.series_id,
        s.name,
        s.format,
        s.type,
        s.start_date,
        s.end_date,
        s.host_country
      FROM series s
      WHERE s.series_id = ?
      `,
      [id]
    );

    if (seriesRows.length === 0) {
      return res.status(404).json({ message: "Series not found" });
    }

    const series = seriesRows[0];

    // Get all matches for this series
    const [matches] = await pool.query(
      `
      SELECT 
        m.match_id,
        m.match_date,
        t1.name AS team1,
        t2.name AS team2,
        t1.logo_url AS team1_logo,
        t2.logo_url AS team2_logo,
        v.venue_name AS venue
      FROM \`match\` m
      JOIN teams t1 ON m.team1_id = t1.team_id
      JOIN teams t2 ON m.team2_id = t2.team_id
      LEFT JOIN venue v ON m.venue_id = v.venue_id
      WHERE m.series_id = ?
      ORDER BY m.match_date ASC
      `,
      [id]
    );

    res.json({ series, matches });
  } catch (err) {
    console.error("Error fetching series details:", err);
    res.status(500).json({ message: "Server error fetching series details" });
  }
});

// 🏏 Matches Page — Upcoming & Completed Matches
router.get("/matches", async (req, res) => {
  try {
    // Upcoming Matches
    const [upcoming] = await pool.query(`
      SELECT 
        m.match_id,
        m.series_id,
        m.match_date,
        s.name AS series_name,
        t1.name AS team1,
        t2.name AS team2,
        t1.logo_url AS team1_logo,
        t2.logo_url AS team2_logo,
        v.venue_name AS venue
      FROM \`match\` m
      JOIN teams t1 ON m.team1_id = t1.team_id
      JOIN teams t2 ON m.team2_id = t2.team_id
      LEFT JOIN series s ON m.series_id = s.series_id
      LEFT JOIN venue v ON m.venue_id = v.venue_id
      WHERE m.match_date > NOW()
      ORDER BY s.name ASC, m.match_date ASC
    `);

    // Completed Matches
    const [completed] = await pool.query(`
      SELECT 
        m.match_id,
        m.series_id,
        m.match_date,
        s.name AS series_name,
        t1.name AS team1,
        t2.name AS team2,
        t1.logo_url AS team1_logo,
        t2.logo_url AS team2_logo,
        v.venue_name AS venue,
        w.name AS winner_team
      FROM \`match\` m
      JOIN teams t1 ON m.team1_id = t1.team_id
      JOIN teams t2 ON m.team2_id = t2.team_id
      LEFT JOIN teams w ON m.winner_team_id = w.team_id
      LEFT JOIN series s ON m.series_id = s.series_id
      LEFT JOIN venue v ON m.venue_id = v.venue_id
      WHERE m.match_date < NOW()
      ORDER BY s.name ASC, m.match_date DESC
    `);

    res.json({ upcoming, completed });
  } catch (err) {
    console.error("Error fetching matches:", err);
    res.status(500).json({ message: "Server error fetching matches" });
  }
});


// 🏏 Single Match — Get match details by ID
router.get("/matches/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const [rows] = await pool.query(`
      SELECT 
        m.match_id,
        s.name AS series_name,
        t1.name AS team1,
        t2.name AS team2,
        t1.logo_url AS team1_logo,
        t2.logo_url AS team2_logo,
        v.venue_name AS venue,
        m.match_date,
        w.name AS winner_team
      FROM \`match\` m
      JOIN teams t1 ON m.team1_id = t1.team_id
      JOIN teams t2 ON m.team2_id = t2.team_id
      LEFT JOIN teams w ON m.winner_team_id = w.team_id
      LEFT JOIN series s ON m.series_id = s.series_id
      LEFT JOIN venue v ON m.venue_id = v.venue_id
      WHERE m.match_id = ?
      LIMIT 1
    `, [id]);

    if (rows.length === 0) {
      return res.status(404).json({ message: "Match not found" });
    }

    res.json(rows[0]);
  } catch (err) {
    console.error("Error fetching match details:", err);
    res.status(500).json({ message: "Server error fetching match details" });
  }
});

  return router;
};
