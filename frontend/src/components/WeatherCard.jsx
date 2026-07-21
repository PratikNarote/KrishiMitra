import { useEffect, useState } from "react";
import { getWeatherByCoords, getLocationName } from "../services/weather";

function WeatherCard() {
  const [weather, setWeather] = useState(null);
  const [location, setLocation] = useState("");

 useEffect(() => {
  navigator.geolocation.getCurrentPosition(
    async (position) => {

         console.log("Latitude:", position.coords.latitude);
      console.log("Longitude:", position.coords.longitude);

     try {
  const lat = position.coords.latitude;
  const lon = position.coords.longitude;

  const weatherData = await getWeatherByCoords(lat, lon);
  setWeather(weatherData);

  const locationData = await getLocationName(lat, lon);

  const area =
    locationData.address.suburb ||
    locationData.address.neighbourhood ||
    locationData.address.village ||
    locationData.address.town ||
    locationData.address.city;

  setLocation(area);

} catch (err) {
  console.error(err);
}

    },
    () => {
      alert("Location permission denied.");
    }
  );
}, []);

  if (!weather) return <p>Loading weather...</p>;

  return (
    <div className="weather-card">
      <h2>🌤 Current Weather</h2>

     <h3>📍 {location || weather.name}</h3>

      <p>🌡 Temperature: {weather.main.temp} °C</p>

      <p>💧 Humidity: {weather.main.humidity}%</p>

      <p>🌬 Wind Speed: {weather.wind.speed} m/s</p>

      <p>☁ Condition: {weather.weather[0].main}</p>
    </div>
  );
}

export default WeatherCard;