const express = require("express");
const router = express.Router();
const Continent = require("../models/Continent");

// ✅ Create Continent
router.post("/", async (req, res) => {
  console.log('BODY:', req.body);
  try {
    const continent = new Continent(req.body);
    await continent.save();
    res.status(201).json(continent);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// ✅ Get All Continents
router.get("/", async (req, res) => {
  try {
    const continents = await Continent.find();
    res.json(continents);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Get Single Continent by ID
router.get("/:id", async (req, res) => {
  try {
    const continent = await Continent.findById(req.params.id);
    if (!continent) return res.status(404).json({ error: "Continent not found" });
    res.json(continent);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Update Continent
router.put("/:id", async (req, res) => {
  try {
    const continent = await Continent.findByIdAndUpdate(
      req.params.id,
      { name: req.body.name },
      { new: true, runValidators: true }
    );
    if (!continent) return res.status(404).json({ error: "Continent not found" });
    res.json(continent);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// ✅ Delete Continent
router.delete("/:id", async (req, res) => {
  try {
    const continent = await Continent.findByIdAndDelete(req.params.id);
    if (!continent) return res.status(404).json({ error: "Continent not found" });
    res.json({ message: "Continent deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
