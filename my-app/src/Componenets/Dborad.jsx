import React, { useEffect, useState } from "react";
import Navbar from "./Navbar";
import { motion } from "framer-motion";
import axios from "axios";

const API_KEY = "8e88a178b6f8d7c81283a7bf200969fa";

const weatherFor = (key) => {
  const k = (key || "").toLowerCase();
  if (/rain|drizzle/.test(k)) return { icon: "🌧️", text: "Rainy" };
  if (/cloud|mist/.test(k)) return { icon: "☁️", text: "Cloudy" };
  if (/clear/.test(k)) return { icon: "☀️", text: "Clear" };
  return { icon: "🌤️", text: "Sunny" };
};

const Dborad = () => {
  const [hives, setHives] = useState([]);
  const [heaters, setHeaters] = useState({});
  const [weather, setWeather] = useState({
    temp: 25,
    humidity: 60,
    pressure: 1013,
    wind: 0,
    climate: "Sunny",
  });
  const [time, setTime] = useState(new Date());
  const farmId = localStorage.getItem("farmId");

  // 🔹 Update clock every second
  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  // 🔹 Fetch weather once
  const fetchWeather = async () => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(async (pos) => {
      const { latitude: lat, longitude: lon } = pos.coords;
      try {
        const res = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`
        );
        const data = await res.json();
        setWeather({
          temp: Math.round(data.main.temp),
          humidity: data.main.humidity,
          pressure: data.main.pressure,
          wind: Math.round(data.wind?.speed || 0),
          climate: data.weather[0].main,
        });
      } catch (err) {
        console.error("Error fetching weather:", err);
      }
    });
  };

  // 🔹 Send API key to backend
  const sendApiKey = async (farmId, apiKey) => {
    try {
      const res = await axios.post("http://localhost:5000/api/saveKey", {
        farmId,
        apiKey,
      });
      alert("API key saved successfully!");
      console.log(res.data);
    } catch (err) {
      console.error(err);
      alert("Error saving API key");
    }
  };

  // 🔹 Fetch hive data from ThingSpeak
  const fetchHives = async () => {
    try {
      const res = await fetch(
        `https://api.thingspeak.com/channels/3126283/feeds.json?api_key=C4SNIR7EP4W21360&results=1`
      );
      const data = await res.json();

      if (data && Array.isArray(data.feeds) && data.feeds.length > 0) {
        const latest = data.feeds[0];
        const lastUpdateTime = new Date(latest.created_at);
        const now = new Date();
        const diffMin = (now - lastUpdateTime) / 60000; // minutes

        const hiveData = [
          {
            id: 1,
            temp: parseFloat(latest.field2) || 0,
            humidity: parseFloat(latest.field3) || 0,
            ph: parseFloat(latest.field4) || 0,
            weight: parseFloat(latest.field5) || 0,
            live: diffMin < 1, // offline if older than 1 minute
          },
        ];
        setHives(hiveData);
      } else {
        setHives([]);
      }
    } catch (err) {
      console.error("Error fetching hive data:", err);
      setHives([]);
    }
  };

  // 🔹 Initial + every 1 minute update
  useEffect(() => {
    fetchWeather();
    fetchHives();
    const id = setInterval(fetchHives, 60000); // 🔁 every 1 min
    return () => clearInterval(id);
  }, []);

  // 🔹 Calculate overall hive health
  const avgPh =
    hives.length > 0
      ? hives.reduce((s, h) => s + (h.ph || 0), 0) / hives.length
      : 0;

  const idealTemp = 35;
  const idealHumidity = 65;

  const tempScore = Math.min(100, Math.abs((weather.temp - idealTemp) / 10) * 100);
  const humidityScore = Math.min(100, Math.abs((weather.humidity - idealHumidity) / 35) * 100);
  const phScore = Math.min(100, Math.abs((avgPh - 6.8) / 1.5) * 100);
  const urgency = Math.round(tempScore * 0.5 + humidityScore * 0.3 + phScore * 0.2);

  const gaugeColor = urgency > 60 ? "bg-red-500" : urgency > 30 ? "bg-yellow-400" : "bg-green-500";

  const toggleHeater = (id) => {
    setHeaters((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const addHive = () => {
    const newHive = {
      id: hives.length + 1,
      temp: 0,
      humidity: 0,
      ph: 0,
      weight: 0,
      live: false,
    };
    setHives((prev) => [...prev, newHive]);
  };

  // 🔹 Gauge Component
  const Gauge = ({ value = 0, size = 140, stroke = 12 }) => {
    const radius = (size - stroke) / 2;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (value / 100) * circumference;
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
          style={{ transform: "rotate(-90deg)", transformOrigin: "50% 50%" }}
        />
        <text x="50%" y="50%" dominantBaseline="middle" textAnchor="middle" fontSize="20" fill="#33691e">
          {value}%
        </text>
      </svg>
    );
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#689f38" }}>
      <Navbar />
      <main className="mt-20 max-w-7xl mx-auto px-6 py-8 text-[#f0f4c3]">
        {/* HEADER */}
        <header className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 gap-4">
          <div>
            <h1 className="text-4xl font-bold text-[#f0f4c3]">Hive Dashboard 🐝</h1>
            <p className="text-sm text-[#f0f4c3]/80">Overview of hive health and local weather</p>
          </div>
          <div className="flex items-center gap-3">
            <p>Farm ID: {farmId}</p>
            <button
              onClick={() => {
                const apiKey = prompt("Enter your API key:");
                if (!apiKey) return;
                sendApiKey(farmId, apiKey);
              }}
              className="bg-[#f0f4c3] text-[#33691e] px-4 py-2 rounded-lg shadow hover:scale-105 transition-transform font-semibold"
            >
              Update key
            </button>
            <button
              onClick={addHive}
              className="bg-[#33691e] text-[#f0f4c3] px-4 py-2 rounded-lg shadow hover:bg-[#2e7d32] transition-transform"
            >
              Add Hive
            </button>
          </div>
        </header>

        {/* WEATHER + SCORE */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Weather Card */}
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

          {/* Gauge Card */}
          <motion.div
            className="col-span-1 md:col-span-2 bg-[#f0f4c3] text-[#33691e] rounded-3xl shadow-lg p-6 flex items-center justify-center border border-[#cddc39]"
            whileHover={{ scale: 1.01 }}
          >
            <div className="flex flex-col items-center gap-4 md:flex-row md:gap-8">
              <Gauge value={urgency} size={160} stroke={14} />
              <div className="max-w-md">
                <h3 className="text-xl font-semibold">Care Attention Score</h3>
                <p className="text-sm text-[#558b2f]">
                  Estimated attention required based on hive and weather.
                </p>
                <div className="mt-4 flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${gaugeColor}`} />
                  <div className="text-sm font-medium">{urgency}%</div>
                </div>
              </div>
            </div>
          </motion.div>
        </section>

        {/* HIVES */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-semibold text-[#f0f4c3]">Hive Summary</h2>
            <div className="text-sm text-[#f0f4c3]/80">Last updated: {time.toLocaleTimeString()}</div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {hives.length === 0 ? (
              <p className="text-[#f0f4c3]">No hive data available...</p>
            ) : (
              hives.map((h) => (
                <motion.div
                  key={h.id}
                  className={`rounded-2xl p-5 shadow-md border transition-all duration-300 ${
                    h.live ? "bg-[#f0f4c3] border-[#cddc39]" : "bg-gray-200 border-gray-300"
                  }`}
                  whileHover={{ scale: 1.03 }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <div className="text-sm text-[#33691e] font-medium">Hive #{h.id}</div>
                      <div
                        className={`text-2xl font-bold ${
                          h.temp > 37 ? "text-red-600" : "text-[#33691e]"
                        }`}
                      >
                        {h.temp}°C
                      </div>
                    </div>
                    <div
                      className={`w-3 h-3 rounded-full ${
                        h.live ? "bg-green-500" : "bg-red-500"
                      }`}
                      title={h.live ? "Online" : "Offline"}
                    />
                  </div>

                  <div className="text-sm text-[#33691e] space-y-1 mb-3">
                    <div>Humidity: {h.humidity}%</div>
                    <div>pH: {h.ph}</div>
                    <div>Weight: {h.weight} kg</div>
                    {!h.live && (
                      <div className="text-red-600 text-xs font-semibold">
                        Device Offline (no update &gt;1 min)
                      </div>
                    )}
                  </div>

                  <div className="mt-2 flex items-center justify-between gap-2">
                    <button
                      onClick={() => toggleHeater(h.id)}
                      className={`px-3 py-1 rounded-full text-sm font-semibold transition ${
                        heaters[h.id]
                          ? "bg-red-500 text-white shadow-md"
                          : "bg-[#33691e] text-[#f0f4c3] hover:bg-[#2e7d32]"
                      }`}
                    >
                      {heaters[h.id] ? "Heater ON" : "Turn On Heater"}
                    </button>
                    <button className="text-sm text-[#558b2f] hover:underline font-medium">
                      Details
                    </button>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </section>
      </main>
    </div>
  );
};

export default Dborad;
