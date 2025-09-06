const mongoose = require("mongoose");

const RouteSchema = new mongoose.Schema(
  {
    source: { type: mongoose.Schema.Types.ObjectId, ref: "Place", required: true },
    destination: { type: mongoose.Schema.Types.ObjectId, ref: "Place", required: true },
    description: { type: String, default: "" },
  },
  { timestamps: true }
);

// ✅ Prevent duplicates of the same source→destination
RouteSchema.index({ source: 1, destination: 1 }, { unique: true });

module.exports = mongoose.model("Route", RouteSchema);
