const mongoose = require('mongoose');

const hiveSchema = new mongoose.Schema({
  farmId: { type: Number, required: true },
  deviceId: { type: String, required: true },
  temp: Number,
  humidity: Number,
  ph: Number,
  weight: Number,
  lastUpdated: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Hive', hiveSchema);
