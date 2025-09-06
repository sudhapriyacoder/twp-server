const express = require("express");
const router = express.Router();
const Country = require("../models/Country");

// ✅ Create Country
router.post("/", async (req, res) => {
  try {
    const country = new Country(req.body);
    await country.save();

    // Populate continent before sending back
    const populatedCountry = await country.populate("continentId", "name");
    res.status(201).json(populatedCountry);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// ✅ Get All Countries (with continent details)
router.get("/", async (req, res) => {
  try {
    const countries = await Country.find().populate("continentId", "name");
    res.json(countries);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Get Countries by Continent
router.get("/byContinent/:continentId", async (req, res) => {
  try {
    const countries = await Country.find({ continentId: req.params.continentId })
      .populate("continentId", "name");
    res.json(countries);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Get Single Country by ID
router.get("/:id", async (req, res) => {
  try {
    const country = await Country.findById(req.params.id).populate("continentId", "name");
    if (!country) return res.status(404).json({ error: "Country not found" });
    res.json(country);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Update Country
router.put("/:id", async (req, res) => {
  try {
    const country = await Country.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate("continentId", "name");

    if (!country) return res.status(404).json({ error: "Country not found" });
    res.json(country);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// ✅ Delete Country
router.delete("/:id", async (req, res) => {
  try {
    const country = await Country.findByIdAndDelete(req.params.id);
    if (!country) return res.status(404).json({ error: "Country not found" });
    res.json({ message: "Country deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
