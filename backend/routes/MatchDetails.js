const express = require("express");

module.exports = (pool) => {
  const router = express.Router();

  router.get("/:id", async (req, res) => {
    const matchId = req.params.id;

    try {
      // Match info
      const [[match]] = await pool.query(`
        SELECT m.match_id, s.name AS series_name, m.match_date,
               v.venue_name AS venue,
               t1.team_id AS team1_id, t1.name AS team1,
               t2.team_id AS team2_id, t2.name AS team2,
               wt.team_id AS winner_team_id, wt.name AS winner_team
        FROM \`match\` m
        LEFT JOIN series s ON m.series_id = s.series_id
        LEFT JOIN teams t1 ON m.team1_id = t1.team_id
        LEFT JOIN teams t2 ON m.team2_id = t2.team_id
        LEFT JOIN teams wt ON m.winner_team_id = wt.team_id
        LEFT JOIN venue v ON m.venue_id = v.venue_id
        WHERE m.match_id = ?
      `, [matchId]);

      if (!match) return res.status(404).json({ message: "Match not found" });

      // Match info (summary)
      const [[info]] = await pool.query(`
        SELECT toss_winner, decision, umpire1, umpire2, result_summary
        FROM match_info WHERE match_id = ?
      `, [matchId]);

      // Playing XI
      const [playingXI] = await pool.query(`
        SELECT mp.id AS xi_id, mp.team_id, t.name AS team_name, 
               p.player_id, p.name AS player_name, p.role
        FROM match_playing_xi mp
        JOIN players p ON mp.player_id = p.player_id
        JOIN teams t ON mp.team_id = t.team_id
        WHERE mp.match_id = ?
        ORDER BY mp.team_id, mp.id;
      `, [matchId]);

      // All score entries
      const [scoreRows] = await pool.query(`
        SELECT ms.id AS score_id, ms.team_id, t.name AS team_name,
               p.player_id, p.name AS player_name,
               ms.runs, ms.balls, ms.fours, ms.sixes, ms.strike_rate,
               ms.wickets, ms.overs, ms.economy
        FROM match_scorecard ms
        JOIN players p ON ms.player_id = p.player_id
        JOIN teams t ON ms.team_id = t.team_id
        WHERE ms.match_id = ?
        ORDER BY ms.team_id, ms.id;
      `, [matchId]);

      // Split properly per innings
      const innings = [
        {
          team_id: match.team1_id,
          team_name: match.team1,
          batting: scoreRows.filter(s => s.team_id === match.team1_id && (s.runs > 0 || s.balls > 0)),
          bowling: scoreRows.filter(s => s.team_id === match.team2_id && (s.overs > 0 || s.wickets > 0)),
        },
        {
          team_id: match.team2_id,
          team_name: match.team2,
          batting: scoreRows.filter(s => s.team_id === match.team2_id && (s.runs > 0 || s.balls > 0)),
          bowling: scoreRows.filter(s => s.team_id === match.team1_id && (s.overs > 0 || s.wickets > 0)),
        },
      ];

      res.json({ match, info: info || null, playingXI, innings });
    } catch (err) {
      console.error("Error fetching match details:", err);
      res.status(500).json({ message: "Server error fetching match details" });
    }
  });

  return router;
};
