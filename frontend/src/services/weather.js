import axios from "axios";

const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;

// Weather by city
export const getWeather = async (city) => {
  const response = await axios.get(
    `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${API_KEY}`
  );

  return response.data;
};

// Weather by coordinates
export const getWeatherByCoords = async (lat, lon) => {
  const response = await axios.get(
    `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`
  );

  return response.data;
};

export const getLocationName = async (lat, lon) => {
  const response = await fetch(
    `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lon}`
  );

  return await response.json();
};