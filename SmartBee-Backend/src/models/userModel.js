const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }, 
  phoneNumber: { type: String, required: true },
  address: { type: String, required: true },
  farmName: { type: String, required: true },
  farmID: { type: String, required: true, unique: true }
});

const User = mongoose.model("User", userSchema);

module.exports = User;