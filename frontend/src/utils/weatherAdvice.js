const getWeatherAdvice = (weather) => {
  if (!weather) return [];

  const advice = [];

  const temp = weather.main?.temp;
  const humidity = weather.main?.humidity;
  const wind = weather.wind?.speed;
  const condition = weather.weather?.[0]?.main;

  // 🌡 Temperature-based advice
  if (temp >= 35) {
    advice.push("🌡️ High temperature detected. Crops may experience heat stress.");
    advice.push("💧 Water crops during early morning or evening.");
    advice.push("☀️ Avoid spraying pesticides during peak sunlight.");
  } 
  else if (temp >= 30) {
    advice.push("🌡️ Warm weather detected. Monitor crops for heat stress.");
    advice.push("💧 Maintain adequate soil moisture.");
  } 
  else if (temp <= 15) {
    advice.push("🥶 Low temperature detected.");
    advice.push("🌱 Protect young plants from cold stress.");
  } 
  else {
    advice.push("🌡️ Temperature is suitable for normal crop growth.");
  }

  // 💧 Humidity-based advice
  if (humidity >= 80) {
    advice.push("💧 High humidity detected. Fungal diseases may spread faster.");
    advice.push("🚫 Avoid overhead watering.");
    advice.push("🔍 Inspect leaves regularly for fungal infections.");
  } 
  else if (humidity >= 60) {
    advice.push("💧 Moderate humidity detected. Monitor crops for fungal diseases.");
    advice.push("🌱 Maintain good air circulation between plants.");
  } 
  else {
    advice.push("💧 Low humidity detected. Monitor soil moisture regularly.");
  }

  // 🌬 Wind-based advice
  if (wind >= 8) {
    advice.push("🌬️ Strong wind detected. Avoid pesticide spraying today.");
    advice.push("🌾 Support young or tall plants against wind damage.");
  } 
  else if (wind >= 4) {
    advice.push("🌬️ Moderate wind detected. Check plants for physical damage.");
  } 
  else {
    advice.push("🌬️ Wind conditions are suitable for normal field activities.");
  }

  // ☁️ Weather condition
  if (
    condition === "Rain" ||
    condition === "Drizzle" ||
    condition === "Thunderstorm"
  ) {
    advice.push("🌧️ Rainy weather detected.");
    advice.push("🚫 Delay fungicide and pesticide spraying until rainfall stops.");
    advice.push("💧 Ensure proper field drainage to prevent waterlogging.");
  } 
  else if (condition === "Clouds") {
    advice.push("☁️ Cloudy weather detected.");
    advice.push("🌱 Monitor leaves carefully because prolonged cloudy conditions can increase disease risk.");
    advice.push("💨 Maintain good air circulation around crops.");
  } 
  else if (condition === "Clear") {
    advice.push("☀️ Clear weather is suitable for field inspection.");
    advice.push("🔍 Inspect crops for pests and disease symptoms.");
  }

  return advice;
};

export default getWeatherAdvice;