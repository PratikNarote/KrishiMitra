import { useState } from "react";
import api from "./services/api";

import diseaseInfo from "./data/diseaseInfo";
import advisoryData from "./data/advisory";

import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import WeatherCard from "./components/WeatherCard";
import ConfidenceMeter from "./components/ConfidenceMeter";
import ChatBot from "./components/ChatBot";
import History from "./components/History";

import generateReport from "./utils/generateReport";
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

  const [top3, setTop3] = useState([]);

  const [refreshHistory, setRefreshHistory] = useState(false);

  // =====================================================
  // WEATHER ADVICE
  // =====================================================

  const weatherAdvice = getWeatherAdvice(weather);

  // =====================================================
  // DISEASE INFORMATION
  // =====================================================

  const info = disease
    ? diseaseInfo[disease]
    : null;

  // =====================================================
  // FARMING ADVISORY
  // =====================================================

  const advisory = disease
    ? advisoryData[disease]
    : null;

  // =====================================================
  // PREDICT CROP DISEASE
  // =====================================================

  const handlePredict = async () => {
    if (!selectedFile) {
      alert("Please select an image.");
      return;
    }

    const formData = new FormData();

    formData.append("file", selectedFile);

    try {
      setLoading(true);

      const response = await api.post(
        "/predict",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log(
        "Prediction Response:",
        response.data
      );

      // Main prediction
      setDisease(response.data.disease || "");

      setConfidence(
        response.data.confidence || 0
      );

      // Top 3 predictions
      setTop3(
        response.data.top3 || []
      );

      // Refresh history
      setRefreshHistory(
        (prev) => !prev
      );

    } catch (error) {
      console.error(
        "Prediction error:",
        error
      );

      alert(
        "Prediction failed. Please try again."
      );

    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // WEATHER UPDATE
  // =====================================================

  const handleWeatherUpdate = (
    weatherData,
    locationName
  ) => {
    console.log(
      "Weather:",
      weatherData
    );

    console.log(
      "Location:",
      locationName
    );

    setWeather(weatherData);

    setLocation(locationName);
  };

  // =====================================================
  // DOWNLOAD AI REPORT
  // =====================================================

  const handleDownloadReport = () => {

    if (!disease) {
      alert(
        "Please analyze a crop first."
      );
      return;
    }

    if (!weather) {
      alert(
        "Weather information is not available yet. Please wait for the weather to load."
      );
      return;
    }

    if (!info) {
      alert(
        `Disease information is missing for: ${disease}`
      );

      console.error(
        "Missing diseaseInfo for:",
        disease
      );

      return;
    }

    if (!advisory) {
      alert(
        `Farming advisory is missing for: ${disease}`
      );

      console.error(
        "Missing advisoryData for:",
        disease
      );

      return;
    }

    try {
generateReport(
  disease,
  confidence,
  weather,
  info,
  advisory,
  weatherAdvice,
  location,
  top3
);

    } catch (error) {

      console.error(
        "Report generation error:",
        error
      );

      alert(
        "Unable to generate the AI report."
      );
    }
  };

  // =====================================================
  // UI
  // =====================================================

  return (
    <>
      <Navbar />

      <div className="container">

        {/* HERO */}
        <Hero />

        {/* WEATHER */}
        <WeatherCard
          onWeatherUpdate={
            handleWeatherUpdate
          }
        />

        {/* ==========================================
            UPLOAD SECTION
        ========================================== */}

        <div className="upload-card">

          <input
            type="file"
            accept="image/*"
            onChange={(e) => {

              const file =
                e.target.files[0];

              setSelectedFile(file);

              if (file) {

                setPreview(
                  URL.createObjectURL(file)
                );

                // Clear old prediction
                setDisease("");
                setConfidence("");
                setTop3([]);
              }

            }}
          />

          {/* ==========================================
              IMAGE PREVIEW
          ========================================== */}

          {preview && (
            <div className="preview-container">

              <h3>Leaf Preview</h3>

              <img
                src={preview}
                alt="Leaf Preview"
                className="leaf-preview"
              />

            </div>
          )}

          {/* ==========================================
              ANALYZE BUTTON
          ========================================== */}

          <button
            className="predict-btn"
            onClick={handlePredict}
            disabled={loading}
          >
            {loading
              ? "🔄 Analyzing..."
              : "🔍 Analyze Crop"}
          </button>

          <br />
          <br />

          {/* ==========================================
              LOADING
          ========================================== */}

          {loading && (
            <h3>
              🤖 AI is analyzing your crop...
            </h3>
          )}

          {/* ==========================================
              PREDICTION RESULT
          ========================================== */}

          {disease && !loading && (

            <div className="prediction-result">

              <h2>
                🌿 Prediction Result
              </h2>

              {/* ====================================
                  DISEASE
              ==================================== */}

              <h3>Disease</h3>

              <p>
                {disease}
              </p>

              {/* ====================================
                  CONFIDENCE
              ==================================== */}

              <h3>Confidence</h3>

            

              <ConfidenceMeter
                confidence={confidence}
              />

              {/* ====================================
                  TOP 3 PREDICTIONS
              ==================================== */}

              {top3.length > 0 && (
                <>
                  <h3>
                    🏆 Top 3 Predictions
                  </h3>

                  <div className="top3-card">

                    {top3.map(
                      (item, index) => (

                        <div
                          key={index}
                          className="top3-item"
                        >

                          <strong>
                            {index + 1}.{" "}
                            {item.disease}
                          </strong>

                          <br />

                          Confidence:{" "}
                          {item.confidence}%

                        </div>

                      )
                    )}

                  </div>
                </>
              )}

              {/* ====================================
                  DESCRIPTION + TREATMENT
              ==================================== */}

              {info ? (

                <>

                  <h3>
                    📋 Description
                  </h3>

                  <p>
                    {info.description}
                  </p>

                  <h3>
                    💊 Recommended Treatment
                  </h3>

                  {info.treatment &&
                  info.treatment.length > 0 ? (

                    <ul className="treatment-list">

                      {info.treatment.map(
                        (item, index) => (

                          <li key={index}>
                            ✅ {item}
                          </li>

                        )
                      )}

                    </ul>

                  ) : (

                    <p>
                      Treatment information
                      is not available.
                    </p>

                  )}

                </>

              ) : (

                <div className="warning-box">

                  ⚠️ Disease information
                  is not available for:

                  <strong>
                    {" "}{disease}
                  </strong>

                </div>

              )}

              {/* ====================================
                  AI FARMING ADVISORY
              ==================================== */}

              {advisory ? (

                <>

                  <h3>
                    🌾 AI Farming Advisory
                  </h3>

                  {advisory.advice &&
                  advisory.advice.length > 0 ? (

                    <ul className="treatment-list">

                      {advisory.advice.map(
                        (item, index) => (

                          <li key={index}>
                            🌱 {item}
                          </li>

                        )
                      )}

                    </ul>

                  ) : (

                    <p>
                      Farming advisory
                      is not available.
                    </p>

                  )}

                </>

              ) : (

                <div className="warning-box">

                  ⚠️ Farming advisory
                  is not available for:

                  <strong>
                    {" "}{disease}
                  </strong>

                </div>

              )}

              {/* ====================================
                  WEATHER BASED ADVISORY
              ==================================== */}

              {weatherAdvice &&
              weatherAdvice.length > 0 && (

                <>

                  <h3>
                    🌦 Weather Based AI Recommendation
                  </h3>

                  <ul className="treatment-list">

                    {weatherAdvice.map(
                      (item, index) => (

                        <li key={index}>
                          🌤 {item}
                        </li>

                      )
                    )}

                  </ul>

                </>

              )}

              {/* ====================================
                  DOWNLOAD REPORT
              ==================================== */}

              <button
                className="download-btn"
                onClick={
                  handleDownloadReport
                }
              >
                📄 Download AI Report
              </button>

            </div>
          )}

        </div>

        {/* ==========================================
            CHATBOT
        ========================================== */}

        <ChatBot
          disease={disease}
          weather={weather}
          location={location}
          advisory={advisory}
          weatherAdvice={weatherAdvice}
        />

        {/* ==========================================
            HISTORY
        ========================================== */}

        <History
          refresh={refreshHistory}
        />

      </div>
    </>
  );
}

export default App;