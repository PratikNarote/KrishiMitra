import { jsPDF } from "jspdf";

const generateReport = (
  disease,
  confidence,
  weather,
  info,
  advisory,
  weatherAdvice,
  location,
  top3 = []
) => {
  try {
    const doc = new jsPDF();

    let y = 20;

    // Remove emojis / unsupported Unicode characters
    const cleanText = (text) => {
  return String(text)
    // Remove emojis and symbols
    .replace(
      /[\u{1F000}-\u{1FFFF}\u{2300}-\u{23FF}\u{2600}-\u{27BF}]/gu,
      ""
    )
    // Remove emoji variation selectors
    .replace(/[\uFE00-\uFE0F]/g, "")
    // Remove zero-width characters
    .replace(/[\u200B-\u200D\uFEFF]/g, "")
    .trim();
};

    // Check whether a new page is required
    const checkPage = (requiredSpace = 10) => {
      if (y + requiredSpace > 275) {
        doc.addPage();
        y = 20;
      }
    };

    // =========================
    // TITLE
    // =========================

    doc.setFontSize(20);
    doc.text("KrishiMitra AI Report", 20, y);

    y += 15;

    doc.setFontSize(11);

    doc.text(
      `Date: ${new Date().toLocaleString()}`,
      20,
      y
    );

    y += 8;

    doc.text(
      `Location: ${location || "Not available"}`,
      20,
      y
    );

    // =========================
    // PREDICTION
    // =========================

    y += 15;

    checkPage(30);

    doc.setFontSize(15);
    doc.text("Prediction Result", 20, y);

    y += 10;

    doc.setFontSize(11);

    doc.text(
      `Disease: ${disease || "Not available"}`,
      25,
      y
    );

    y += 8;

    doc.text(
      `Confidence: ${confidence ?? "N/A"}%`,
      25,
      y
    );

    // =========================
    // TOP 3 PREDICTIONS
    // =========================

    y += 15;

    checkPage(40);

    doc.setFontSize(15);
    doc.text("Top 3 Predictions", 20, y);

    y += 10;

    doc.setFontSize(11);

    if (top3.length > 0) {
      top3.forEach((item, index) => {
        checkPage(10);

        doc.text(
          `${index + 1}. ${item.disease} - ${item.confidence}%`,
          25,
          y
        );

        y += 8;
      });
    } else {
      doc.text(
        "Top 3 predictions not available.",
        25,
        y
      );

      y += 8;
    }

    // =========================
    // DESCRIPTION
    // =========================

    y += 8;

    checkPage(40);

    doc.setFontSize(15);
    doc.text("Description", 20, y);

    y += 10;

    doc.setFontSize(11);

    const descriptionLines = doc.splitTextToSize(
      info?.description || "No description available.",
      165
    );

    descriptionLines.forEach((line) => {
      checkPage(8);
      doc.text(line, 25, y);
      y += 6;
    });

    // =========================
    // TREATMENT
    // =========================

    y += 8;

    checkPage(40);

    doc.setFontSize(15);
    doc.text("Recommended Treatment", 20, y);

    y += 10;

    doc.setFontSize(11);

    if (info?.treatment?.length > 0) {
      info.treatment.forEach((item) => {
        const cleanItem = cleanText(item);

        const lines = doc.splitTextToSize(
          `- ${cleanItem}`,
          165
        );

        lines.forEach((line) => {
          checkPage(8);
          doc.text(line, 25, y);
          y += 6;
        });

        y += 2;
      });
    } else {
      doc.text(
        "Treatment information not available.",
        25,
        y
      );

      y += 8;
    }

    // =========================
    // AI FARMING ADVISORY
    // =========================

    y += 8;

    checkPage(40);

    doc.setFontSize(15);
    doc.text("AI Farming Advisory", 20, y);

    y += 10;

    doc.setFontSize(11);

    if (advisory?.advice?.length > 0) {
      advisory.advice.forEach((item) => {
        const cleanItem = cleanText(item);

        const lines = doc.splitTextToSize(
          `- ${cleanItem}`,
          165
        );

        lines.forEach((line) => {
          checkPage(8);
          doc.text(line, 25, y);
          y += 6;
        });

        y += 2;
      });
    } else {
      doc.text(
        "AI advisory information not available.",
        25,
        y
      );

      y += 8;
    }

    // =========================
    // CURRENT WEATHER
    // =========================

    y += 8;

    checkPage(50);

    doc.setFontSize(15);
    doc.text("Current Weather", 20, y);

    y += 10;

    doc.setFontSize(11);

    if (weather?.main) {
      doc.text(
        `Temperature: ${weather.main.temp ?? "N/A"} °C`,
        25,
        y
      );

      y += 8;

      doc.text(
        `Humidity: ${weather.main.humidity ?? "N/A"}%`,
        25,
        y
      );

      y += 8;

      doc.text(
        `Wind Speed: ${weather.wind?.speed ?? "N/A"} m/s`,
        25,
        y
      );

      y += 8;

      doc.text(
        `Condition: ${weather.weather?.[0]?.main ?? "N/A"}`,
        25,
        y
      );
    } else {
      doc.text(
        "Weather information not available.",
        25,
        y
      );
    }

    // =========================
    // WEATHER ADVISORY
    // =========================

    y += 15;

    checkPage(50);

    doc.setFontSize(15);
    doc.text(
      "Weather Based AI Recommendation",
      20,
      y
    );

    y += 10;

    doc.setFontSize(11);

    if (weatherAdvice?.length > 0) {
      weatherAdvice.forEach((item) => {
        const cleanItem = cleanText(item);

        const lines = doc.splitTextToSize(
          `- ${cleanItem}`,
          165
        );

        lines.forEach((line) => {
          checkPage(8);
          doc.text(line, 25, y);
          y += 6;
        });

        y += 2;
      });
    } else {
      doc.text(
        "No weather-based recommendations available.",
        25,
        y
      );
    }

    // =========================
    // FOOTER
    // =========================

    const pageCount = doc.internal.getNumberOfPages();

    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);

      doc.setFontSize(9);

      doc.text(
        `KrishiMitra AI | Page ${i} of ${pageCount}`,
        20,
        290
      );
    }

    // =========================
    // SAVE PDF
    // =========================

    doc.save("KrishiMitra_AI_Report.pdf");

    console.log("✅ AI Report downloaded successfully");

  } catch (error) {
    console.error(
      "❌ Report generation error:",
      error
    );

    alert("Unable to generate report.");
  }
};

export default generateReport;