const express = require("express");
const router = express.Router();
const passport = require("passport");
const User = require("../models/User");

router.get("/register", (req, res) => {
  res.render("register");
});

router.post("/register", async (req, res) => {
  const { username, password } = req.body;
  const user = new User({ username });
  user.password = await user.encryptPassword(password);
  await user.save();
  res.redirect("/login");
});

router.get("/login", (req, res) => {
  res.render("login");
});

router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/posts",
    failureRedirect: "/login",
  })
);

router.get("/logout", (req, res) => {
  req.logout(() => {
    res.redirect("/login");
  });
});

module.exports = router;
