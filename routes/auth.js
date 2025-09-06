const express = require("express");
const jwt = require("jsonwebtoken");
const { OAuth2Client } = require("google-auth-library");
const User = require("../models/User"); // your MongoDB user schema

const router = express.Router();
const client = new OAuth2Client("885873323934-j4s6c3qsdg72vvtkh2f3325p8dddv28i.apps.googleusercontent.com");

// POST /api/auth/google
router.post("/google", async (req, res) => {
  try {
    const { token } = req.body;

    // Verify Google token
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: "885873323934-j4s6c3qsdg72vvtkh2f3325p8dddv28i.apps.googleusercontent.com",
    });
    const payload = ticket.getPayload();

    // Check if user exists in DB, otherwise create
    let user = await User.findOne({ email: payload.email });
    if (!user) {
      user = await User.create({
        name: payload.name,
        email: payload.email,
        picture: payload.picture,
      });
    }

    // Create your own JWT for session
    const customToken = jwt.sign(
      { id: user._id, email: user.email },
      "MY_SECRET_KEY",
      { expiresIn: "1h" }
    );

    res.json({ token: customToken, user });
  } catch (err) {
    console.error(err);
    res.status(401).json({ error: "Invalid Google login" });
  }
});

module.exports = router;
