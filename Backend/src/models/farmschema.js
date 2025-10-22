const mongoose = require('mongoose');

const farmSchema = new mongoose.Schema({
  farmId: { type: String, required: true, unique: true },
  thingspeakApiKey: { type: String, required: true },
});

module.exports = mongoose.model('Farm', farmSchema);
