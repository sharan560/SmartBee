const mongoose = require('mongoose');
// const config = require('./default');

const connectDB = async () => {
  const uri = process.env.MONGO_URI || config.mongoUri || 'mongodb://localhost:27017/smartbee';
  try {
    console.log('Connecting to MongoDB at', uri);
    const conn = await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000,
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (err) {
    console.error('MongoDB connection error:', err.message || err);
    // exit so deployment fails loudly (Render will retry)
    process.exit(1);
  }
};

module.exports = connectDB;
