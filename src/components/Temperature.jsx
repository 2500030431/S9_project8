import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const Temperature = () => {

    const [temp, setTemp] = useState(null);
    const [city, setCity] = useState("");

    const getWeather = () => {
        if (!city) {
            alert("Please enter a city name");
            return;
        }

        axios.get(
            "https://geocoding-api.open-meteo.com/v1/search",
            { params: { name: city, count: 1 } }
        )
        .then(res => {
            if (!res.data.results) throw new Error("City not found");

            const { latitude, longitude } = res.data.results[0];

            return axios.get(
                "https://api.open-meteo.com/v1/forecast",
                {
                    params: {
                        latitude,
                        longitude,
                        current_weather: true
                    }
                }
            );
        })
        .then(res => {
            setTemp(res.data.current_weather.temperature);
        })
        .catch(() => {
            alert("City not found. Please try again.");
            setTemp(null);
        });
    };

    const getTempEmoji = (t) => {
        if (t < 15) return "❄️";
        if (t >= 15 && t <= 30) return "🌤️";
        return "🔥";
    };

    return (
        <div style={styles.page}>
            <div style={styles.head}>
                <Link to="/" style={styles.link}>Main Page</Link>
                <Link to="/temperature" style={styles.link}>Weather Page</Link>
                <h3 style={{ color: "white" }}>
                    Weather Check using Axios
                </h3>
            </div>

            <div style={styles.box}>
                <input
                    type="text"
                    placeholder="Enter city name"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    style={styles.input}
                />

                <button onClick={getWeather} style={styles.button}>
                    Check Weather
                </button>

                {temp !== null && (
                    <h1 style={styles.temp}>
                        {temp} °C {getTempEmoji(temp)}
                    </h1>
                )}
            </div>
        </div>
    );
};

const styles = {
    page: {
        fontFamily: "Arial, sans-serif",
        background: "linear-gradient(to right, #74ebd5, #9face6)",
        minHeight: "100vh"
    },
    head: {
        backgroundColor: "#2c3e50",
        padding: "15px",
        textAlign: "center"
    },
    link: {
        color: "white",
        margin: "0 15px",
        textDecoration: "none",
        fontWeight: "bold"
    },
    box: {
        backgroundColor: "white",
        width: "350px",
        margin: "40px auto",
        padding: "25px",
        borderRadius: "10px",
        textAlign: "center",
        boxShadow: "0 8px 20px rgba(0,0,0,0.2)"
    },
    input: {
        width: "80%",
        padding: "10px",
        fontSize: "16px",
        marginBottom: "15px",
        borderRadius: "5px",
        border: "1px solid #ccc",
        outline: "none"
    },
    button: {
        padding: "10px 20px",
        fontSize: "16px",
        backgroundColor: "#3498db",
        color: "white",
        border: "none",
        borderRadius: "5px",
        cursor: "pointer"
    },
    temp: {
        marginTop: "20px",
        color: "#2c3e50"
    }
};

export default Temperature;