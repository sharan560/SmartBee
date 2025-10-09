import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../Context/AuthConetxt";
import styles from "../Styles/DashBoard.module.css";
import cloud from "../assets/2.png";

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

  if (loading) return null;

  return (
    <>
      <div className={styles.cloudImage}>
        <img src={cloud} alt="Cloud" className={styles.cloudImage} />
      </div>
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
              <button className={styles.detailsButton}>Turn On Hive Heater</button>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Home;
