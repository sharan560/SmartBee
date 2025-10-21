import React from "react";
import styles from "../Styles/LandingPage.module.css";
import developer from '../assets/Developer.jpg';
const features = [
  {
    icon: "🌡️",
    title: "Temperature Monitoring",
    desc: "Track hive temperature in real-time to maintain optimal conditions for bees.",
    btn: "View Temperature",
  },
  {
    icon: "💧",
    title: "pH Level Monitoring",
    desc: "Monitor the hive's pH levels to ensure a healthy environment for the colony.",
    btn: "Check pH",
  },
  {
    icon: "💨",
    title: "Humidity Tracking",
    desc: "Keep humidity levels stable to protect your bees and their honey production.",
    btn: "View Humidity",
  },
  {
    icon: "📦",
    title: "Hive Load Measurement",
    desc: "Measure hive weight to track honey production and bee activity trends.",
    btn: "Check Hive Load",
  },
  {
    icon: "⚡",
    title: "Instant Alerts",
    desc: "Receive real-time alerts via SMS or app notifications if any parameter crosses safe limits.",
    btn: "View Alerts",
  },
  {
    icon: "📊",
    title: "Historical Data",
    desc: "Analyze historical data to understand trends and make informed beekeeping decisions.",
    btn: "View Data",
  }
];

const team = [
  {
    name: "Sharan Nagarajan",
    role: "Developer",
    img: developer,
    linkedin: "https://www.linkedin.com/in/sharan-n-046706291/",
    github: "https://github.com/sharan560",
  },
];

const LandingPage = () => {
  return (
    <div className={styles.landingRoot}>


      <section className={styles.heroSection}>
        <h1 className={styles.heroTitle}>Welcome to SmartBee 🐝</h1>
        <p className={styles.heroTagline}>
          Monitor your bee hives in real-time with our IoT system. Stay informed, protect your bees, and optimize honey production.
        </p>
        <button className={styles.heroButton}>Transform Your Hive Monitoring With Us</button>
      </section>


      <section className={styles.featuresSection}>

        <div className={styles.featuresGrid}>
          {features.map((f) => (
            <div className={styles.featureCard} key={f.title}>
              <div className={styles.featureIcon}>{f.icon}</div>
              <div className={styles.featureTitle}>{f.title}</div>
              <div className={styles.featureDesc}>{f.desc}</div>
              <button className={styles.featureBtn}>{f.btn}</button>
            </div>
          ))}
        </div>
      </section>



      <section className={styles.aboutSection}>
        <h2>About SmartBee</h2>
        <div className={styles.aboutContent}>
          <div className={styles.aboutText}>
            <p>
              SmartBee is an IoT-based bee hive monitoring system designed to help beekeepers
              maintain healthy colonies. By tracking temperature, humidity, pH, and hive load,
              SmartBee provides real-time alerts and historical data analytics, helping beekeepers
              ensure optimal conditions for their bees and maximize honey production.
            </p>
            <p>
              With environmental tips and continuous monitoring, SmartBee also helps protect the
              surrounding flora and maintain a sustainable ecosystem.
            </p>
            <p>
              <strong>Fun Fact:</strong> Bees are vital pollinators, supporting 1/3 of the world's food crops.
              A healthy bee colony can pollinate thousands of plants, helping maintain biodiversity.
            </p>
          </div>
          <div className={styles.aboutImage}>
            <img 
              src="https://images.unsplash.com/photo-1579462188084-2a2df681a39d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w5NjUyOXwwfDF8c2VhcmNofDF8fGJlZXxlbnwwfHx8fDE2OTg2MjU3NzN8&ixlib=rb-4.0.3&q=80&w=400" 
              alt="Bee on flower" 
            />
          </div>
        </div>
      </section>

      <section className={styles.teamSection}>
        <h2>Meet the Team</h2>
        <div className={styles.teamGrid}>
          {team.map((member) => (
            <div className={styles.teamCard} key={member.name}>
              <img className={styles.teamImg} src={member.img} alt={member.name} />
              <div className={styles.teamName}>{member.name}</div>
              <div className={styles.teamRole}>{member.role}</div>
              <div className={styles.teamLinks}>
                <a href={member.linkedin} target="_blank" rel="noopener noreferrer">
                  LinkedIn
                </a>
                <a href={member.github} target="_blank" rel="noopener noreferrer">
                  GitHub
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>

      <footer className={styles.footer}>
        <div class Name={styles.footerContact}>
          <span>Contact: </span>
          <a href="mailto:nsharan006@gmail.com">nsharan006@gmail.com</a>
        </div>
        <div className={styles.footerLinks}>
          <a href="#">Twitter</a>
          <a href="#">LinkedIn</a>
          <a href="#">Docs</a>
        </div>
        <div className={styles.footerCopy}>
          &copy; {new Date().getFullYear()} SmartBee. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
