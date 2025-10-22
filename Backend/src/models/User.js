const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phoneNumber: { type: String },
  address: { type: String },
  farmName: { type: String, required: true },
  farmId: { type: String, required: true, unique: true }, // Added farmId
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);
