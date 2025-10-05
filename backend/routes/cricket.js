const axios = require("axios");
const express = require("express");
const router = express.Router();

const API_KEY = "05df61ef-ab62-4d41-b456-1bb39d0edd72"; // put your real API key

router.get("/live-matches", async (req, res) => {
  try {
    const response = await axios.get("https://api.cricapi.com/v1/currentMatches", {
      params: {
        apikey: API_KEY,
        offset: 0
      },
    });

    res.json(response.data); // JSON response
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Failed to fetch live matches" });
  }
});

module.exports = router;
