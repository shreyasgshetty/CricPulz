const express = require("express");

module.exports = (pool) => {
  const router = express.Router();

  // 🏏 TEAM RANKINGS
  router.get("/teams", async (req, res) => {
    try {
      const [rows] = await pool.query(`
        SELECT 
          tr.ranking_id,
          tr.team_id,
          tr.ranking_type,
          tr.rank,
          tr.points,
          t.name AS team_name,
          t.logo_url,
          t.country,
          t.type
        FROM team_rankings tr
        JOIN teams t ON tr.team_id = t.team_id
        WHERE tr.rank IS NOT NULL
        ORDER BY tr.ranking_type, tr.rank ASC
      `);

      // Group by ranking_type
      const grouped = { ODI: [], T20: [], Test: [] };
      rows.forEach((r) => {
        if (grouped[r.ranking_type]) grouped[r.ranking_type].push(r);
      });

      res.json(grouped);
    } catch (err) {
      console.error("Error fetching team rankings:", err);
      res.status(500).json({ message: "Server error fetching team rankings" });
    }
  });

  // 🏏 PLAYER RANKINGS
  router.get("/players", async (req, res) => {
    try {
      const [rows] = await pool.query(`
        SELECT 
          pr.ranking_id,
          pr.player_id,
          pr.ranking_type,
          pr.rank,
          pr.points,
          p.name AS player_name,
          p.country,
          p.role,
          t.logo_url AS team_logo
        FROM player_rankings pr
        JOIN players p ON pr.player_id = p.player_id
        LEFT JOIN teams t ON p.team_id = t.team_id
        WHERE pr.rank IS NOT NULL
        ORDER BY pr.ranking_type, pr.rank ASC
      `);

      const grouped = { batting: [], bowling: [], allrounder: [] };
      rows.forEach((r) => {
        if (grouped[r.ranking_type]) grouped[r.ranking_type].push(r);
      });

      res.json(grouped);
    } catch (err) {
      console.error("Error fetching player rankings:", err);
      res.status(500).json({ message: "Server error fetching player rankings" });
    }
  });

  return router;
};
