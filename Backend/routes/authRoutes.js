const express = require("express");
const passport = require("../config/passportConfig");
const jwt = require("jsonwebtoken");

const router = express.Router();

router.get("/github", passport.authenticate("github", { scope: ["user:email"] }));

router.get(
  "/github/callback",
  passport.authenticate("github", { failureRedirect: "/" }),
  (req, res) => {
    const user = req.user;
    const token = jwt.sign({ id: user.id, name: user.username }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    res.cookie("token", token, { httpOnly: true, secure: true, sameSite: "Strict" });
    res.redirect(`${process.env.FRONTEND_URL}/verify`);
  }
);

router.get("/logout", (req, res) => {
  res.clearCookie("token");
  req.logout(() => {
    res.redirect(`${process.env.FRONTEND_URL}/`);
  });
});

router.get("/user", (req, res) => {
  if (req.isAuthenticated()) {
    res.json({ user: req.user });
  } else {
    res.json({ user: null });
  }
});


module.exports = router; // ✅ Corrected for CommonJS
