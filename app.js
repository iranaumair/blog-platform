const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const passport = require("passport");
const dotenv = require("dotenv");
const User = require("./models/User");

dotenv.config();

const app = express();

// Database connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Middleware
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: false }));
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());

// Passport config
passport.use(
  new (require("passport-local").Strategy)(async (username, password, done) => {
    try {
      const user = await User.findOne({ username });
      if (!user) return done(null, false, { message: "No user found" });

      const isMatch = await user.matchPassword(password);
      if (!isMatch) return done(null, false, { message: "Incorrect password" });

      return done(null, user);
    } catch (err) {
      return done(err);
    }
  })
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err);
  }
});

// Routes
app.use("/", require("./routes/auth"));
app.use("/posts", require("./routes/posts"));

module.exports = app;
