const express = require("express");

module.exports = (pool) => {
  const router = express.Router();

  // 📰 Fetch all approved news with author name
  router.get("/", async (req, res) => {
    try {
      const [rows] = await pool.query(`
        SELECT 
          n.id,
          n.title,
          n.content,
          n.created_at,
          u.name AS author_name
        FROM news n
        JOIN user u ON n.author_id = u.user_id
        WHERE n.status = 'approved'
        ORDER BY n.created_at DESC
      `);

      res.json(rows);
    } catch (err) {
      console.error("Error fetching news:", err);
      res.status(500).json({ message: "Server error fetching news" });
    }
  });

  return router;
};
