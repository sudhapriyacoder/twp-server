const express = require("express");
const router = express.Router();
const Continent = require("../models/Continent");
const Country = require("../models/Country");
const State = require("../models/State");
const City = require("../models/City");

// GET /api/taxonomy/full
router.get("/all", async (req, res) => {
  try {
    const continents = await Continent.aggregate([
      // Step 1: Join continents → countries
      {
        $lookup: {
          from: "countries",
          localField: "_id",
          foreignField: "continentId",
          as: "countries"
        }
      },
      // Step 2: Join countries → states
      {
        $lookup: {
          from: "states",
          localField: "countries._id",
          foreignField: "countryId",
          as: "allStates"
        }
      },
      // Step 3: Join states → cities
      {
        $lookup: {
          from: "cities",
          localField: "allStates._id",
          foreignField: "stateId",
          as: "allCities"
        }
      },
      // Step 4: Build hierarchy
      {
        $addFields: {
          countries: {
            $map: {
              input: "$countries",
              as: "country",
              in: {
                $mergeObjects: [
                  "$$country",
                  {
                    states: {
                      $map: {
                        input: {
                          $filter: {
                            input: "$allStates",
                            as: "st",
                            cond: { $eq: ["$$st.countryId", "$$country._id"] }
                          }
                        },
                        as: "state",
                        in: {
                          $mergeObjects: [
                            "$$state",
                            {
                              cities: {
                                $filter: {
                                  input: "$allCities",
                                  as: "ct",
                                  cond: { $eq: ["$$ct.stateId", "$$state._id"] }
                                }
                              }
                            }
                          ]
                        }
                      }
                    }
                  }
                ]
              }
            }
          }
        }
      },
      // Step 5: Cleanup temp arrays
      {
        $project: {
          allStates: 0,
          allCities: 0
        }
      }
    ]);

    res.json(continents);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});





router.get("/continents", async (req, res) => {
  try {
    const continents = await Continent.find().lean();
    const countries = await Country.find().lean();

    const data = {};
    continents.forEach((c) => {
      data[c.name] = countries
        .filter((ctry) => String(ctry.continentId) === String(c._id))
        .map((ctry) => ({ id: ctry._id, name: ctry.name }));
    });

    res.json(continents);
    
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


router.get("/locations/:countryId", async (req, res) => {
  try {
    const states = await State.find({ countryId: req.params.countryId }).lean();
    const cities = await City.find({ countryId: req.params.countryId }).lean();

    res.json({
      states: states.map((s) => ({ id: s._id, name: s.name })),
      cities: cities.map((c) => ({ id: c._id, name: c.name })),
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;