const mongoose = require("mongoose");

const PostSchema = new mongoose.Schema({
  title: String,
  body: String,
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Post", PostSchema);
