// routes/places.js
const express = require("express");
const router = express.Router();
const Place = require("../models/Place"); // your places schema
const City = require("../models/City");
const State = require("../models/State");
const Country = require("../models/Country");
const Route = require("../models/Route");


// GET /api/places/:cityId
router.get("/:cityId", async (req, res) => {
  try {
    const { cityId } = req.params;

    // ensure city belongs to a state & country
    const city = await City.findById(cityId).lean();
    if (!city) return res.status(404).json({ error: "City not found" });

    const state = await State.findById(city.stateId).lean();
    const country = await Country.findById(city.countryId).lean();

    // fetch places linked to that city
    const places = await Place.find({ cityId }).lean();

    // fetch routes linked to that city
    const routes = await Route.find()
      .populate({
        path: "source",
        match: { cityId },
      })
      .populate({
        path: "destination",
        match: { cityId },
      })
      .lean();

    // only keep routes with both source & destination populated
    const filteredRoutes = routes.filter(r => r.source && r.destination);

    res.json({
      continentId: country.continentId,
      countryId: country._id,
      stateId: state._id,
      cityId: city._id,
      cityName: city.name,
      places,
      routes: filteredRoutes, // ✅ now includes description
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
