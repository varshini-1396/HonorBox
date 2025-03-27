const express = require("express");
const User = require("../models/User");
const router = express.Router();
router.post("/user", async (req, res) => {
  try {
    const { name, email, googleId } = req.body;
    let user = await User.findOne({ email });

    if (user) {
      return res.status(200);
    }

    // Create new user if not found
    user = new User({ name, email, googleId });
    await user.save();
    console.log(user);

    res
      .status(201)
  } catch (error) {
    res.status(500)
  }
});

module.exports = router;
