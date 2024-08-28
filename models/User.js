const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const UserSchema = new mongoose.Schema({
  username: String,
  password: String,
});

UserSchema.methods.encryptPassword = async function (password) {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
};

UserSchema.methods.matchPassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

module.exports = mongoose.model("User", UserSchema);
