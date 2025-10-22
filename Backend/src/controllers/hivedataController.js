const THINGSPEAK_URL =
  'https://api.thingspeak.com/channels/3125760/feeds.json?api_key=PE62UYDA1GP3B74T&results=4' // get last 4 feeds

router.get('/latest', async (req, res) => {
  try {
    const response = await axios.get(THINGSPEAK_URL)
    const data = response.data

    if (!data || !data.feeds || data.feeds.length === 0) {
      return res.status(404).json({ message: 'No data found' })
    }

    // Transform ThingSpeak fields into your frontend format
    const transformedData = data.feeds.map((feed, index) => ({
      id: index + 1,
      temp: Number(feed.field2),       // f2 -> temp
      humidity: Number(feed.field3),   // f3 -> humidity
      ph: Number(feed.field1),         // f1 -> ph
      weight: Math.floor(Math.random() * 10 + 15), // example weight 15-25
      live: index % 2 === 0             // example live true/false alternately
    }))

    res.json(transformedData)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Failed to fetch ThingSpeak data', error: error.message })
  }
})

module.exports = router
