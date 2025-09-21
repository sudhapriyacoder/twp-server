const express = require("express");
const jwt = require("jsonwebtoken");
const { OAuth2Client } = require("google-auth-library");
const User = require("../models/User"); // Your MongoDB user schema

const router = express.Router();

const GOOGLE_CLIENT_ID = "503344184716-ce2svade719pd9hm0lr71l19npt5fe75.apps.googleusercontent.com";
const JWT_SECRET = "MY_SECRET_KEY"; // Replace with your own secret key

const client = new OAuth2Client(GOOGLE_CLIENT_ID);

router.post("/google", async (req, res) => {
  try {
    const { token } = req.body;

    // Verify Google ID token
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();

    // Find or create user in DB
    let user = await User.findOne({ email: payload.email });
    if (!user) {
      user = await User.create({
        name: payload.name,
        email: payload.email,
        picture: payload.picture,
      });
    }

    // Sign your own JWT for session
    const customToken = jwt.sign(
      { id: user._id, email: user.email },
      JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({ token: customToken, user });
  } catch (err) {
    console.error(err);
    res.status(401).json({ error: "Invalid Google login" });
  }
});

module.exports = router;
