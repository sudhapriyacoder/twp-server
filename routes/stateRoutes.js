const express = require("express");
const router = express.Router();
const State = require("../models/State");

// ✅ Create State
router.post("/", async (req, res) => {
  try {
    let state = new State(req.body);
    await state.save();
    state = await State.findById(state._id).populate("countryId"); // populate before sending
    res.status(201).json(state);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// ✅ Get All States (with country details)
router.get("/", async (req, res) => {
  try {
    const states = await State.find().populate("countryId");
    res.json(states);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Get States by Country
router.get("/byCountry/:countryId", async (req, res) => {
  try {
    const states = await State.find({ countryId: req.params.countryId }).populate("countryId");
    res.json(states);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Update State
router.put("/:id", async (req, res) => {
  try {
    let state = await State.findByIdAndUpdate(req.params.id, req.body, { new: true });
    state = await State.findById(state._id).populate("countryId"); // repopulate
    res.json(state);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// ✅ Delete State
router.delete("/:id", async (req, res) => {
  try {
    await State.findByIdAndDelete(req.params.id);
    res.json({ message: "State deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
