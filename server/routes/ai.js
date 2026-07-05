const express = require("express");
const router = express.Router();
const Message = require("../models/Message");
const { generateSummary, searchMessages } = require("../ai");

// POST /api/summary  -> summarize last 20-30 messages
router.post("/summary", async (req, res) => {
  try {
    const data = await Message.find({})
      .sort({ createdAt: -1 })
      .limit(30).lean();

    if (data.length === 0) {
      return res.json({ summary: "No messages yet to summarize." });
    }

    
   const messages= data.reverse();
    const summary = await generateSummary(messages);
    res.json({ summary });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to generate summary" });
  }
});

router.post("/search", async (req, res) => {
  try {
    const { query } = req.body;

    if (!query) {
      return res.status(400).json({ error: "Query is required" });
    }

    const messages = await Message.find({})
      .sort({ createdAt: -1 })
      .limit(100)
      .lean();

    messages.reverse();

    const answer = await searchMessages(query, messages);
    res.json({ answer });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to search messages" });
  }
});

module.exports = router;
