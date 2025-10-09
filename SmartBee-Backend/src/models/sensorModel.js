const mongoose = require("mongoose");

const sensorSchema = new mongoose.Schema({
  temp: { type: Number, required: true },
  humidity: { type: Number, required: true },
  ph: { type: Number, required: true, default: 0 },
  farmID: { type: String, required: true }  
});

const Sensor = mongoose.model("Sensor", sensorSchema);
module.exports = Sensor;
