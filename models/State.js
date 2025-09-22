const mongoose = require("mongoose");

const stateSchema = new mongoose.Schema({
  name: { type: String, required: true },
  countryId: { type: mongoose.Schema.Types.ObjectId, ref: "Country", required: true },
  trendingSequence: { type: Number, default: null },
  imageUrl: { type: String, default: "" }
});

module.exports = mongoose.model("State", stateSchema);
