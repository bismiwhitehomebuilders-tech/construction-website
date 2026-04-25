const express = require("express");
const axios = require("axios");
const path = require("path");

const app = express();
const PORT = 3000;

// serve frontend
app.use(express.static(__dirname));

// API
app.get("/search", async (req, res) => {
  try {
    const q = req.query.q;

    const response = await axios.get(
      `https://striveschool-api.herokuapp.com/api/deezer/search?q=${encodeURIComponent(q)}`
    );

    res.json(response.data);
  } catch (err) {
    console.log("❌ API ERROR:", err.message);
    res.status(500).json({ error: "Failed to fetch data" });
  }
});

// default
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
