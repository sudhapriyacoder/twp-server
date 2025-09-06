const mongoose = require("mongoose");

const continentSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true }
});

module.exports = mongoose.model("Continent", continentSchema);
