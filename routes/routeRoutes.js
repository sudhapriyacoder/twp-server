const express = require("express");
const mongoose = require("mongoose");
const Route = require("../models/Route");
const router = express.Router();

// ➕ Bulk Upsert Routes (no duplicates)
router.post("/bulk", async (req, res) => {
  try {
    const { routes } = req.body; // [{source, destination, description}]
    if (!Array.isArray(routes)) return res.status(400).json({ error: "routes must be an array" });

    const ops = routes.map(r => ({
      updateOne: {
        filter: {
          source: new mongoose.Types.ObjectId(r.source),
          destination: new mongoose.Types.ObjectId(r.destination),
        },
        update: {
          $set: {
            description: (r.description || "").trim(),
          },
        },
        upsert: true,
      },
    }));

    await Route.bulkWrite(ops, { ordered: false });
    res.json({ message: "Routes saved successfully" });
  } catch (err) {
    console.error("❌ Error saving routes:", err);
    res.status(500).json({ error: err.message });
  }
});

// 📄 Get Routes for a City (with description)
router.get("/:cityId", async (req, res) => {
  try {
    const { cityId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(cityId)) {
      return res.status(400).json({ error: "Invalid cityId" });
    }

    const oid = new mongoose.Types.ObjectId(cityId);

    const routes = await Route.find()
      .populate({ path: "source", match: { cityId: oid } })
      .populate({ path: "destination", match: { cityId: oid } })
      .lean();

    // keep only routes where both ends belong to the city
    const filtered = routes.filter(r => r.source && r.destination);

    res.json(filtered);
  } catch (err) {
    console.error("❌ Error fetching routes:", err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
