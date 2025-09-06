// routes/user.js
const express = require("express");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const router = express.Router();
const mongoose = require("mongoose");

// Middleware to protect routes
function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: "No token provided" });

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, "MY_SECRET_KEY");
    req.user = decoded; // { id, email }
    next();
  } catch (err) {
    res.status(401).json({ error: "Invalid token" });
  }
}

// GET logged-in user profile (with favorites & cart)
router.get("/me", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .populate("favorites")
      .populate("cart");
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST toggle favorite
// POST toggle favorite
router.post("/favorites", authMiddleware, async (req, res) => {
  try {
    const { placeId } = req.body;
    const user = await User.findById(req.user.id);

    const exists = user.favorites.includes(placeId);
    if (exists) {
      user.favorites.pull(placeId);
    } else {
      user.favorites.push(placeId);
    }
    await user.save();

    // repopulate favorites before returning
    await user.populate("favorites");

    res.json(user.favorites);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/favorites", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate("favorites");
    res.json(user.favorites);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// POST toggle cart
router.post("/cart", authMiddleware, async (req, res) => {
  try {
    const { placeId } = req.body;
    const user = await User.findById(req.user.id);

    const exists = user.cart.includes(placeId);
    if (exists) {
      user.cart.pull(placeId);
    } else {
      user.cart.push(placeId);
    }
    await user.save();

    res.json(user.cart);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ➕ Add to Cart
router.post("/:userId/cart", async (req, res) => {
  console.log('hahahhahahhahahha')
  try {
    const { placeId, userId } = req.body;
    console.log(req.body);
    if (!mongoose.Types.ObjectId.isValid(placeId)) {
      return res.status(400).json({ error: "Invalid placeId" });
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { $addToSet: { cart: placeId } }, // add only if not present
      { new: true }
    ).populate("cart");

    res.json(user.cart);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ❌ Remove from Cart
router.delete("/:userId/cart/:placeId", async (req, res) => {
  try {
    const { userId, placeId } = req.params;
    const user = await User.findByIdAndUpdate(
      userId,
      { $pull: { cart: placeId } },
      { new: true }
    ).populate("cart");

    res.json(user.cart);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 🗑 Clear Cart
router.delete("/:userId/cart", async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.userId,
      { $set: { cart: [] } },
      { new: true }
    ).populate("cart");

    res.json(user.cart);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 📦 Get Cart
router.get("/:userId/cart", async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).populate("cart");
    res.json(user.cart || []);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


module.exports = router;
