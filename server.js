const express = require("express");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

const connectDB = require("./config/db");

// Import routes
const authRoutes = require("./routes/auth");
const continentRoutes = require("./routes/continentRoutes");
const countryRoutes = require("./routes/countryRoutes");
const stateRoutes = require("./routes/stateRoutes");
const cityRoutes = require("./routes/cityRoutes");
const placeRoutes = require("./routes/placeRoutes");
const placesRoutes = require("./routes/places");
const userRoutes = require("./routes/user");
const routeRoutes = require("./routes/routeRoutes");

const app = express();

// ✅ Middleware
app.use(cors()); // For dev, allow all. In prod, restrict by origin
app.use(express.json());

// ✅ Connect DB
connectDB();

// ✅ API Routes
app.use("/api/auth", authRoutes);
app.use("/api/continents", continentRoutes);
app.use("/api/countries", countryRoutes);
app.use("/api/states", stateRoutes);
app.use("/api/cities", cityRoutes);
app.use("/api/places", placeRoutes);
app.use("/api/place", placesRoutes);
app.use("/api/user", userRoutes);
app.use("/api/routes", routeRoutes);
app.use("/api/taxonomy", require("./routes/taxonomy"));



// ✅ Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
