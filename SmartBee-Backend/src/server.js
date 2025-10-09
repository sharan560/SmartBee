const express = require("express"); 
const dotenv = require("dotenv");
const connectDB = require("./config/db"); 
const cors = require("cors");

dotenv.config();

const app = express(); 
app.use(express.json());
app.use(cors());
connectDB();
const userRoutes = require("./routes/userRoutes"); 
app.use("/api/users", userRoutes); 
const senorRoutes = require("./routes/sensorRoutes");
app.use("/api/sensors", senorRoutes); 

app.get("/", (req, res) => {
  res.send("SmartBee Backend is running!");
});

const PORT = process.env.PORT;
app.listen(PORT);

