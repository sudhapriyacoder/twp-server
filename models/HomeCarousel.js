const mongoose = require("mongoose");

const homeCarouselSchema = new mongoose.Schema({
  imageName: { type: String, required: true },
  imageUrl: { type: String, required: true },
  imageSequence: { type: Number, required: true }
});

module.exports = mongoose.model("HomeCarousel", homeCarouselSchema);
