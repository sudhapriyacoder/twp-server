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
const homeCarouselRoutes = require("./routes/homeCarouselRoutes");

const app = express();

const allowedOrigins = [
  'http://localhost:3000',
  'https://twp-ui.onrender.com',
  'https://yourtripmyplan.com',
  'https://www.yourtripmyplan.com'
];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (e.g., mobile apps or curl)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    } else {
      return callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true, // Only if you're using cookies or sessions
}));

app.use(express.json()); // Parse JSON bodies for all routes

// ✅ Connect DB
connectDB();

// ✅ API Routes
app.use("/api/auth", authRoutes);
app.use("/api/continents", continentRoutes);
app.use("/api/countries", countryRoutes);
app.use("/api/states", stateRoutes);
app.use("/api/cities", cityRoutes); // city image is now a string, no upload
app.use("/api/places", placeRoutes);
app.use("/api/place", placesRoutes);
app.use("/api/user", userRoutes);
app.use("/api/routes", routeRoutes);
app.use("/api/home", homeCarouselRoutes);
app.use("/api/taxonomy", require("./routes/taxonomy"));

// ✅ Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
