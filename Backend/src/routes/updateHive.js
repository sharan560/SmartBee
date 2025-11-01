const axios = require('axios');
const Farm = require('../models/farmschema');
const Hive = require('../models/hive');

const fetchAndUpdateHives = async () => {
  try {
    const farms = await Farm.find(); 
    const now = new Date();

    for (const farm of farms) {
      const { thingspeakApiKey } = farm;

      const url = `https://api.thingspeak.com/channels/3126283/feeds.json?api_key=${thingspeakApiKey}&results=100`;
      const res = await axios.get(url);
      const feeds = res.data.feeds;

      if (!feeds || feeds.length === 0) continue;

      // Group feeds by deviceId and keep the latest
      const latestByDevice = {};
      feeds.forEach(feed => {
        const deviceId = feed.field1;
        if (!deviceId) return;

        const createdAt = new Date(feed.created_at);
        if (!latestByDevice[deviceId] || latestByDevice[deviceId].lastUpdated < createdAt) {
          latestByDevice[deviceId] = {
            deviceId,
            temp: parseFloat(feed.field2 || 0),
            humidity: parseFloat(feed.field3 || 0),
            ph: parseFloat(feed.field4 || 0),
            weight: parseFloat(feed.field5 || 0),
            lastUpdated: createdAt,
          };
        }
      });

      // Upsert each latest device feed
      for (const deviceId in latestByDevice) {
        const data = latestByDevice[deviceId];
        await Hive.findOneAndUpdate(
          { farmId: farm.farmId, deviceId }, // match both farmId and deviceId
          {
            farmId: farm.farmId,             // ensure farmId is saved
            deviceId: data.deviceId,
            temp: data.temp,
            humidity: data.humidity,
            ph: data.ph,
            weight: data.weight,
            lastUpdated: data.lastUpdated
          },
          { upsert: true, new: true }
        );
      }
    }

    console.log(`[${now.toISOString()}] Hive data updated for all farms.`);
  } catch (err) {
    console.error('Error updating hives:', err.message);
  }
};

module.exports = fetchAndUpdateHives;
