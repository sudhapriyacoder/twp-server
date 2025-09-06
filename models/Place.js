// models/Place.js
const mongoose = require("mongoose");

const placeSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: String,
    image: String,

    // Category of place
    type: {
      type: String,
      enum: ["temple", "park", "museum", "monument", "beach"],
      required: true,
    },
     linkTo: {
      type: String,
      enum: ["country", "state", "city"],
      required: true,
    },

    // Belongs to
    continentId: { type: mongoose.Schema.Types.ObjectId, ref: "Continent", required: true },
    countryId: { type: mongoose.Schema.Types.ObjectId, ref: "Country", required: true },
    stateId: { type: mongoose.Schema.Types.ObjectId, ref: "State", required: true },
    cityId: { type: mongoose.Schema.Types.ObjectId, ref: "City" },

    // activity: String,
    // mode: String,
    // hotel: String,

    // isWishlisted: { type: Boolean, default: false },
    // isInCart: { type: Boolean, default: false },

    sequence: Number,
    landMark: String
  },
  { timestamps: true }
);


module.exports = mongoose.model("Place", placeSchema);
