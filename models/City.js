const mongoose = require("mongoose");

const citySchema = new mongoose.Schema({
  name: { type: String, required: true },
  countryId: { type: mongoose.Schema.Types.ObjectId, ref: "Country", required: true },
  stateId: { type: mongoose.Schema.Types.ObjectId, ref: "State", required: false }, // 👈 make optional
  cityImage: { type: String },
  beachImageUrl: { type: String },
  templeImageUrl: { type: String },
  monumentImageUrl: { type: String },
  museumImageUrl: { type: String },
  parkImageUrl: { type: String },
  trendingSequence: { type: Number },
});

module.exports = mongoose.model("City", citySchema);