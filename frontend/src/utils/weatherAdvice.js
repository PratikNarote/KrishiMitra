const getWeatherAdvice = (weather) => {
  if (!weather) return [];

  const advice = [];

  const temp = weather.main.temp;
  const humidity = weather.main.humidity;
  const wind = weather.wind.speed;
  const condition = weather.weather[0].main;

  // High Humidity
  if (humidity >= 80) {
    advice.push("High humidity detected. Fungal diseases may spread faster.");
    advice.push("Avoid overhead watering.");
    advice.push("Inspect leaves every day.");
  }

  // High Temperature
  if (temp >= 35) {
    advice.push("High temperature detected.");
    advice.push("Water crops early morning or evening.");
    advice.push("Avoid spraying pesticides during peak sunlight.");
  }

  // Cold Weather
  if (temp <= 15) {
    advice.push("Low temperature detected.");
    advice.push("Protect young plants from cold stress.");
  }

  // Wind
  if (wind >= 8) {
    advice.push("Strong wind detected.");
    advice.push("Avoid pesticide spraying today.");
  }

  // Rain
  if (
    condition === "Rain" ||
    condition === "Drizzle" ||
    condition === "Thunderstorm"
  ) {
    advice.push("Rain expected.");
    advice.push("Delay fungicide spraying until rainfall stops.");
  }

  // Clear Weather
  if (condition === "Clear") {
    advice.push("Weather is suitable for field inspection.");
  }

  return advice;
};

export default getWeatherAdvice;