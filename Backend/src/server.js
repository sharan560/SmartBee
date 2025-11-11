const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

const authRoutes = require("./routes/auth");
const thingSpeakRoutes = require("./routes/hivedata");
const saveKeyRoutes = require("./routes/savekey");
const fetchAndUpdateHives = require("./routes/updateHive");

// Load environment variables
dotenv.config();

// Initialize express app
const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Connect to MongoDB
connectDB();

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/thingspeak", thingSpeakRoutes);
app.use("/api", saveKeyRoutes);

// Hive updater (runs every 30 seconds)
fetchAndUpdateHives();
setInterval(fetchAndUpdateHives, 30 * 1000);

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
