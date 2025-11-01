// Diagnostic: log resolution of express and its internal router to help debug
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');
try {
	const expressMain = require.resolve('express');
	const expressDir = path.dirname(expressMain);
	const expressLib = path.join(expressDir, 'lib');
	console.log('Resolved express main ->', expressMain);
	console.log('Express lib directory ->', expressLib);
	try {
		const files = fs.readdirSync(expressLib);
		console.log('Express lib contents:', files);
	} catch (err) {
		console.warn('Could not read express lib directory:', err.message);
	}
	try {
		console.log('Resolved express/router ->', require.resolve('express/lib/router'));
	} catch (err) {
		console.warn('Could not resolve express/lib/router:', err.message);
	}
} catch (err) {
	console.warn('Express resolution diagnostics failed:', err.message);
}

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
