const mongoose = require("mongoose");

const countrySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  continentId: { type: mongoose.Schema.Types.ObjectId, ref: "Continent", required: true }
});

module.exports = mongoose.model("Country", countrySchema);
