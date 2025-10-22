const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const cors = require('cors');
const fetchAndUpdateHives = require('./routes/updateHive');

// Routes
const authRoutes = require('./routes/auth');
const thingSpeakRoutes = require('./routes/hivedata'); 
const saveKeyRoutes = require('./routes/savekey');

dotenv.config();

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Connect Database
connectDB();

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/thingspeak', thingSpeakRoutes);
app.use('/api', saveKeyRoutes); 

fetchAndUpdateHives();
setInterval(fetchAndUpdateHives, 30 * 1000);

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
