const express = require("express");
const router = express.Router();
const HomeCarousel = require("../models/HomeCarousel");

// Create carousel item
router.post("/", async (req, res) => {
  try {
    const { imageName, imageUrl, imageSequence } = req.body;
    const item = new HomeCarousel({ imageName, imageUrl, imageSequence });
    await item.save();
    res.status(201).json(item);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get all carousel items (sorted by sequence)
router.get("/", async (req, res) => {
  try {
    const items = await HomeCarousel.find().sort({ imageSequence: 1 });
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update carousel item
router.put("/:id", async (req, res) => {
  try {
    const item = await HomeCarousel.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(item);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delete carousel item
router.delete("/:id", async (req, res) => {
  try {
    await HomeCarousel.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
