const express = require("express");
const router = express.Router();
const City = require("../models/City");

// ✅ Create City
router.post("/", async (req, res) => {
  console.log('BODY:', req.body);
  try {
    const { name, countryId, stateId, cityImage } = req.body;
    let trendingSequence = req.body.trendingSequence;
    if (trendingSequence !== undefined) trendingSequence = Number(trendingSequence);
    let city = new City({
      name,
      countryId,
      stateId,
      trendingSequence,
      cityImage
    });

    console.log('NEW CITY:', city);
    await city.save();
    city = await City.findById(city._id)
      .populate("countryId")
      .populate("stateId");
    res.status(201).json(city);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// ✅ Get All Cities (with country + state details)
router.get("/", async (req, res) => {
  try {
    const cities = await City.find()
      .populate("countryId")
      .populate("stateId");
    res.json(cities);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Get Cities by State
router.get("/byState/:stateId", async (req, res) => {
  try {
    const cities = await City.find({ stateId: req.params.stateId })
      .populate("countryId")
      .populate("stateId");
    res.json(cities);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Update City
router.put("/:id", async (req, res) => {
  try {
    let city = await City.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!city) return res.status(404).json({ error: "City not found" });
    city = await City.findById(city._id).populate("countryId").populate("stateId");
    res.json({ ...city.toObject(), _id: city._id });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// ✅ Delete City
router.delete("/:id", async (req, res) => {
  try {
    const city = await City.findByIdAndDelete(req.params.id);
    if (!city) return res.status(404).json({ error: "City not found" });

    res.json({ message: "City deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
