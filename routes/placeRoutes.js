// routes/placeRoutes.js
const express = require("express");
const Place = require("../models/Place");
const router = express.Router();

// ➕ Add Place
router.post("/", async (req, res) => {
  try {
    const place = new Place(req.body);
    await place.save();
    res.status(201).json(place);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// 📄 Get All Places
router.get("/", async (req, res) => {
  try {
    const places = await Place.find()
      .populate("continentId countryId stateId cityId"); // ✅ populate references
    res.json(places);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✏️ Update Place
router.put("/:id", async (req, res) => {
  try {
    const updated = await Place.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// ❌ Delete Place
router.delete("/:id", async (req, res) => {
  try {
    await Place.findByIdAndDelete(req.params.id);
    res.json({ message: "Place deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
