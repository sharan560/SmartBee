const express = require('express')
const router = express.Router()
const Hive = require('../models/hive')


router.get('/latest', async (req, res) => {
   let farmId = req.query.farmId

  if (!farmId) {
    return res.status(400).json({ message: 'farmId is required' })
  }

    farmId = parseInt(farmId);
  try {

    const a=await Hive.find({farmId});
    const latestHives = await Hive.aggregate([
      { $match: { farmId } }, 
      { $sort: { createdAt: -1 } }, 
      {
        $group: {
          _id: "$deviceId", 
          doc: { $first: "$$ROOT" } 
        }
      },
      { $replaceRoot: { newRoot: "$doc" } }, 
      { $sort: { deviceId: 1 } } 
    ])

    const now = new Date()

   
    const updatedHives = latestHives.map(h => {
      const diffMs = now - new Date(h.createdAt)
      const diffMinutes = diffMs / 1000 / 60
      return {
        ...h,
        live: diffMinutes <= 1 // true if last update <= 1 minute
      }
    })
    

    res.status(200).json(updatedHives)
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Server error' })
  }
})

module.exports = router
