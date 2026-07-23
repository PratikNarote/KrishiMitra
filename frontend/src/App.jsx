import { useState } from "react";
import api from "./services/api";
import diseaseInfo from "./data/diseaseInfo";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import WeatherCard from "./components/WeatherCard";
import advisoryData from "./data/advisory";
import generateReport from "./utils/generateReport";
import ConfidenceMeter from "./components/ConfidenceMeter";
import getWeatherAdvice from "./utils/weatherAdvice";

import "./App.css";

function App() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [disease, setDisease] = useState("");
  const [confidence, setConfidence] = useState("");
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState(null);
  const [weather, setWeather] = useState(null);
const [location, setLocation] = useState("");

  const handlePredict = async () => {
    if (!selectedFile) {
      alert("Please select an image.");
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      setLoading(true);

      const response = await api.post("/predict", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setDisease(response.data.disease);
      setConfidence(response.data.confidence);
    } catch (error) {
      alert("Prediction failed.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
      const info = disease ? diseaseInfo[disease] : null;
      const advisory = disease ? advisoryData[disease] : null;

      const handleDownloadReport = () => {
  if (!disease || !weather || !info || !advisory) {
    alert("No prediction available.");
    return;
  }

  generateReport(
  disease,
  confidence,
  weather,
  info,
  advisory,
  weatherAdvice,
  location
);
};

const handleWeatherUpdate = (weatherData, locationName) => {
  setWeather(weatherData);
  setLocation(locationName);
};

const weatherAdvice = getWeatherAdvice(weather);

console.log(weatherAdvice);
  return (
<>
  <Navbar /> 



    <div className="container">

      <Hero />

      <WeatherCard onWeatherUpdate={handleWeatherUpdate} />
           {/* Upload Card */}

      {/* File Upload */}

      <div className="upload-card">

  <input
    type="file"
    accept="image/*"
    onChange={(e) => {
      const file = e.target.files[0];
      setSelectedFile(file);

      if (file) {
        setPreview(URL.createObjectURL(file));
      }
    }}
  />

  {preview && (
    <div className="preview">
      <img src={preview} alt="Leaf Preview" />
    </div>
  )}

  <button
    className="predict-btn"
    onClick={handlePredict}
  >
    🔍 Analyze Crop
  </button>

</div>

      <br /><br />

      {loading && <h3>Predicting...</h3>}

      {disease && (
  <div className="result">
    <h2>🌿 Prediction Result</h2>

    <h3>Disease</h3>
    <p>{disease}</p>

   <h3>Confidence</h3>

<ConfidenceMeter confidence={Number(confidence)} />

<p className="badge">
  {confidence >= 90
    ? "🟢 Very High Confidence"
    : confidence >= 75
    ? "🟡 High Confidence"
    : "🔴 Low Confidence"}
</p>


    {info && (
      <>
        <h3>Description</h3>
        <p>{info.description}</p>

        <h3>Recommended Treatment</h3>

        <ul className="treatment-list">
          {info.treatment.map((item, index) => (
            <li key={index}>✅ {item}</li>
          ))}
        </ul>

{/* AI Farming Advisory */}
{advisory && (
  <>
    <h3>🌾 AI Farming Advisory</h3>

    <ul className="treatment-list">
      {advisory.advice.map((item, index) => (
        <li key={index}>🌱 {item}</li>
      ))}
    </ul>
  </>
)}

</>
)}

{weatherAdvice.length > 0 && (
  <>
    <h3>🌦 Weather Based AI Recommendation</h3>

    <ul className="treatment-list">
      {weatherAdvice.map((item, index) => (
        <li key={index}>{item}</li>
      ))}
    </ul>
  </>
)}

<button
  className="download-btn"
  onClick={handleDownloadReport}
>
  📄 Download AI Report
</button>
    
  </div>
)}

    </div>
    </>
  );
}

export default App;