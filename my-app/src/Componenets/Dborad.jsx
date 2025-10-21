import React, { useEffect, useState } from 'react'
import Navbar from './Navbar'
import { motion } from 'framer-motion'

const API_KEY = "8e88a178b6f8d7c81283a7bf200969fa"

const initialHives = [
  { id: 1, temp: 35, humidity: 70, ph: 6.8, weight: 20, live: true },
  { id: 2, temp: 34, humidity: 65, ph: 6.5, weight: 18, live: false },
  { id: 3, temp: 36, humidity: 72, ph: 7.0, weight: 22, live: false },
  { id: 4, temp: 35, humidity: 70, ph: 6.8, weight: 20, live: true },
]

const weatherFor = (key) => {
  const k = (key || '').toLowerCase()
  if (/rain|drizzle/.test(k)) return { icon: '🌧️', text: 'Rainy' }
  if (/cloud|mist/.test(k)) return { icon: '☁️', text: 'Cloudy' }
  if (/clear/.test(k)) return { icon: '☀️', text: 'Clear' }
  return { icon: '🌤️', text: 'Sunny' }
}

const Dborad = () => {
  const [hives, setHives] = useState(initialHives)
  const [heaters, setHeaters] = useState({})
  const [weather, setWeather] = useState({ temp: 25, humidity: 60, pressure: 1013, wind: 0, climate: 'Sunny' })
  const [time, setTime] = useState(new Date())

  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(t)
  }, [])

  const fetchWeather = async () => {
    if (!navigator.geolocation) return
    navigator.geolocation.getCurrentPosition(async (pos) => {
      const lat = pos.coords.latitude
      const lon = pos.coords.longitude
      try {
        const res = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`
        )

        console.log(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`);
        const data = await res.json()
        setWeather({
          temp: Math.round(data.main.temp),
          humidity: data.main.humidity,
          pressure: data.main.pressure,
          wind: Math.round(data.wind?.speed || 0),
          climate: data.weather[0].main,
        })
      } catch (err) {
        console.error("Error fetching weather:", err)
      }
    })
  }

  const toggleHeater = (id) => {
    setHeaters((prev) => ({ ...prev, [id]: !prev[id] }))
  }


  useEffect(() => {
    fetchWeather()
    const id = setInterval(() => randomizeHiveMetrics(), 8000)
    return () => clearInterval(id)
  }, [])

  const addHive = () => {
  const newId = hives.length + 1
  const newHive = {
    id: newId,
    temp: 0,
    humidity: 0,
    ph: 0,
    weight: 0,
    live: false,
  }
  setHives((prev) => [...prev, newHive])
}


  // Care attention calculation
  const avgPh = hives.reduce((s, h) => s + h.ph, 0) / hives.length
  const idealTemp = 35
  const idealHumidity = 65
  const tempScore = Math.min(100, Math.abs((weather.temp - idealTemp) / 10) * 100)
  const humidityScore = Math.min(100, Math.abs((weather.humidity - idealHumidity) / 35) * 100)
  const phScore = Math.min(100, Math.abs((avgPh - 6.8) / 1.5) * 100)
  const urgency = Math.round(tempScore * 0.5 + humidityScore * 0.3 + phScore * 0.2)
  const gaugeColor = urgency > 60 ? 'bg-red-500' : urgency > 30 ? 'bg-yellow-400' : 'bg-green-500'

  const Gauge = ({ value = 0, size = 140, stroke = 12 }) => {
    const radius = (size - stroke) / 2
    const circumference = 2 * Math.PI * radius
    const offset = circumference - (value / 100) * circumference
    return (
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <defs>
          <linearGradient id="g1" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#33691e" />
            <stop offset="100%" stopColor="#c8e6c9" />
          </linearGradient>
        </defs>
        <circle cx={size / 2} cy={size / 2} r={radius} stroke="#c8e6c9" strokeWidth={stroke} fill="none" />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="url(#g1)"
          strokeWidth={stroke}
          strokeLinecap="round"
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ transform: 'rotate(-90deg)', transformOrigin: '50% 50%' }}
        />
        <text x="50%" y="50%" dominantBaseline="middle" textAnchor="middle" fontSize="20" fill="#33691e">
          {value}%
        </text>
      </svg>
    )
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#689f38' }}>
      <Navbar />

      <main className="mt-20 max-w-7xl mx-auto px-6 py-8 text-[#f0f4c3]">
        {/* Header */}
        <header className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 gap-4">
          <div>
            <h1 className="text-4xl font-bold text-[#f0f4c3]">Hive Dashboard 🐝</h1>
            <p className="text-sm text-[#f0f4c3]/80">Overview of hive health and local weather</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={fetchWeather}
              className="bg-[#f0f4c3] text-[#33691e] px-4 py-2 rounded-lg shadow hover:scale-105 transition-transform font-semibold"
            >
              Refresh Weather
            </button>
            <button
              onClick={addHive}
              className="bg-[#33691e] text-[#f0f4c3] px-4 py-2 rounded-lg shadow hover:bg-[#2e7d32] transition-transform"
            >
              Add Hive
            </button>
          </div>
        </header>

        {/* Weather + Gauge Section */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <motion.div
            className="col-span-1 bg-[#f0f4c3] text-[#33691e] rounded-3xl shadow-lg p-6 border border-[#cddc39]"
            whileHover={{ scale: 1.02 }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="text-5xl">{weatherFor(weather.climate).icon}</div>
                <div>
                  <div className="text-3xl font-bold">{weather.temp}°C</div>
                  <div className="text-sm">{weatherFor(weather.climate).text}</div>
                </div>
              </div>
              <div className="text-sm text-gray-600">{time.toLocaleTimeString()}</div>
            </div>

            <div className="mt-4 grid grid-cols-3 gap-2 text-center">
              <div className="p-2 bg-[#dcedc8] rounded-lg">
                <div className="text-xs text-[#33691e]">Humidity</div>
                <div className="font-semibold">{weather.humidity}%</div>
              </div>
              <div className="p-2 bg-[#dcedc8] rounded-lg">
                <div className="text-xs text-[#33691e]">Pressure</div>
                <div className="font-semibold">{weather.pressure} hPa</div>
              </div>
              <div className="p-2 bg-[#dcedc8] rounded-lg">
                <div className="text-xs text-[#33691e]">Wind</div>
                <div className="font-semibold">{weather.wind} m/s</div>
              </div>
            </div>
          </motion.div>

          {/* Gauge */}
          <motion.div
            className="col-span-1 md:col-span-2 bg-[#f0f4c3] text-[#33691e] rounded-3xl shadow-lg p-6 flex items-center justify-center border border-[#cddc39]"
            whileHover={{ scale: 1.01 }}
          >
            <div className="flex flex-col items-center gap-4 md:flex-row md:gap-8">
              <Gauge value={urgency} size={160} stroke={14} />
              <div className="max-w-md">
                <h3 className="text-xl font-semibold">Care Attention Score</h3>
                <p className="text-sm text-[#558b2f]">Estimated attention required today based on hive and weather conditions.</p>
                <div className="mt-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${gaugeColor}`} />
                    <div className="text-sm font-medium">{urgency}%</div>
                  </div>
                  <ul className="mt-3 text-sm text-[#33691e] space-y-1">
                    <li>Temp deviation: {Math.round(tempScore)}%</li>
                    <li>Humidity deviation: {Math.round(humidityScore)}%</li>
                    <li>pH deviation: {Math.round(phScore)}%</li>
                  </ul>
                </div>
              </div>
            </div>
          </motion.div>
        </section>

        {/* Hive Cards */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-semibold text-[#f0f4c3]">Hive Summary</h2>
            <div className="text-sm text-[#f0f4c3]/80">Last updated: {time.toLocaleTimeString()}</div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {hives.map((h) => (
              <motion.div
                key={h.id}
                className={`rounded-2xl p-5 shadow-md border transition-all duration-300 ${
                  h.live ? 'bg-[#f0f4c3] border-[#cddc39]' : 'bg-gray-200 border-gray-300'
                }`}
                whileHover={{ scale: 1.03 }}
              >
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <div className="text-sm text-[#33691e] font-medium">Hive #{h.id}</div>
                    <div className={`text-2xl font-bold ${h.temp > 37 ? 'text-red-600' : 'text-[#33691e]'}`}>
                      {h.temp}°C
                    </div>
                  </div>
                  <div className={`w-3 h-3 rounded-full ${h.live ? 'bg-green-500' : 'bg-gray-400'}`} />
                </div>

                <div className="text-sm text-[#33691e] space-y-1 mb-3">
                  <div>Humidity: {h.humidity}%</div>
                  <div>pH: {h.ph}</div>
                  <div>Weight: {h.weight} kg</div>
                </div>

                <div className="mt-2 flex items-center justify-between gap-2">
                  <button
                    onClick={() => toggleHeater(h.id)}
                    className={`px-3 py-1 rounded-full text-sm font-semibold transition ${
                      heaters[h.id]
                        ? 'bg-red-500 text-white shadow-md'
                        : 'bg-[#33691e] text-[#f0f4c3] hover:bg-[#2e7d32]'
                    }`}
                  >
                    {heaters[h.id] ? 'Heater ON' : 'Turn On Heater'}
                  </button>
                  <button className="text-sm text-[#558b2f] hover:underline font-medium">Details</button>
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      </main>
    </div>
  )
}

export default Dborad
