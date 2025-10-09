const Sensor = require("../models/sensorModel.js");

exports.getSensorData = async (req, res) => {
  try {
    let { temp, humidity, ph} = req.body;
    farmID="FARM$0001"
    temp = parseFloat(temp);
    humidity = parseFloat(humidity);
    ph = parseFloat(ph);

    if (!temp || !humidity || !ph) {
      return res.status(400).json({ message: "All fields are required and must be valid numbers" });
    }

    const sensor = new Sensor({ temp, humidity, ph, farmID });
    await sensor.save();

    res.status(201).json({ message: "Sensor data saved successfully" });
  } catch (err) {
    console.error("Error saving sensor data:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
