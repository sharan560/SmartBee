const express = require('express');
const router = express.Router();
const Farm = require('../models/farmschema');

// POST /api/saveKey
router.post('/saveKey', async (req, res) => {
  const { farmId, apiKey } = req.body;

  if (!farmId || !apiKey) {
    return res.status(400).json({ message: 'farmId and apiKey are required' });
  }

  try {
    // Check if farm already exists
    let farm = await Farm.findOne({ farmId });

    if (farm) {
      // Update existing API key
      farm.thingspeakApiKey = apiKey;
      await farm.save();
      return res.status(200).json({ message: 'API key updated successfully' });
    } else {
      // Create new farm record
      farm = new Farm({ farmId, thingspeakApiKey: apiKey });
      await farm.save();
      return res.status(201).json({ message: 'API key saved successfully' });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
