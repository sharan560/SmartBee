import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../Context/AuthConetxt"; 
import styles from "../Styles/DashBoard.module.css";
import sunny from "../assets/1.png"; 
import rain from "../assets/2.png";
import cloudy from "../assets/4.png";
import clear from "../assets/3.png";

const hives = [
  { id: 1, temp: 35, humidity: 70, ph: 6.8, weight: 20, live: true },
  { id: 2, temp: 34, humidity: 65, ph: 6.5, weight: 18, live: false },
  { id: 3, temp: 36, humidity: 72, ph: 7.0, weight: 22, live: false },
  { id: 4, temp: 35, humidity: 70, ph: 6.8, weight: 20, live: true },
];

const Home = () => {
  const { user, loading } = useContext(AuthContext);
  const navigate = useNavigate();
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState(null);
  const API_KEY = "8e88a178b6f8d7c81283a7bf200969fa";

  const getImage = (climate) => {
    const c = climate?.toLowerCase() || "";
    if (/rain|drizzle/i.test(c)) return rain;
    if (/cloud/i.test(c)) return cloudy;
    if (/clear/i.test(c)) return clear;
    if (/haze|fog|mist/i.test(c)) return cloudy; 
    return sunny; 
  };

  useEffect(() => {
    if (!loading && !user) {
      navigate("/");
    }
  }, [loading, user, navigate]);

 
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lon = position.coords.longitude;
          fetch(
            `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`
          )
            .then((res) => res.json())
            .then((data) => {
              if (data.cod !== 200) {
                setError(data.message);
                return;
              }
              setWeather({
                temp: data.main.temp,
                humidity: data.main.humidity,
                climate: data.weather[0].description,
                icon: data.weather[0].icon,
              });
            })
            .catch(() => setError("Failed to fetch weather"));
        },
        () => setError("Location access denied")
      );
    } else {
      setError("Geolocation not supported");
    }
  }, []);

  const handleHeaterToggle = (id) => {
    console.log(`Toggle heater for Hive ${id}`);
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <>
        {weather && (
          <div className={styles.cloudImage} style={{ position: "relative" }}>
            <img
              src={getImage(weather.climate)}
              alt="Weather Icon"
              className={styles.cloudImage}
            />
              <div className={styles.weatherRightPanel}>
              <div className={styles.weatherCardItem}>
                <p>🌡️ Temp</p>
                <h3>{weather.temp}°C</h3>
              </div>
              <div className={styles.weatherCardItem}>
                <p>💧 Humidity</p>
                <h3>{weather.humidity}%</h3>
              </div>
              <div className={styles.weatherCardItem}>
                <p>🌤️ Climate</p>
                <h3>{weather.climate}</h3>
              </div>
            </div>

            </div>
        )}


      <div className={styles.dashboardContainer}>
        <div className={styles.rightPanel}>
          {hives.map((hive) => (
            <div key={hive.id} className={styles.hiveCard}>
              <div
                className={`${styles.statusDot} ${
                  hive.live ? styles.live : styles.notLive
                }`}
              ></div>
              <p>Hive No: {hive.id}</p>
              <p>🌡️ Temp: {hive.temp}°C</p>
              <p>💧 Humidity: {hive.humidity}%</p>
              <p>🧪 pH: {hive.ph}</p>
              <p>⚖️ Weight: {hive.weight}kg</p>
              <p>Status: {hive.live ? "Live" : "Not Live"}</p>
              <button
                className={styles.detailsButton}
                onClick={() => handleHeaterToggle(hive.id)}
              >
                Turn On Hive Heater
              </button>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Home;
