const express= require("express");
const { getSensorData } = require("../controllers/sensorController");
const router = express.Router();
router.post("/temp", getSensorData);
module.exports = router;