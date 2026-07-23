import { jsPDF } from "jspdf";

const generateReport = (
  disease,
  confidence,
  weather,
  info,
  advisory,
  weatherAdvice,
  location
) => {

  console.log(weatherAdvice);
  const doc = new jsPDF();

  doc.setFontSize(20);
  doc.text("KrishiMitra AI Report", 20, 20);

  doc.setFontSize(12);

  doc.text(`Date: ${new Date().toLocaleString()}`, 20, 35);

  doc.text(`Location: ${location}`, 20, 45);

  doc.text("Weather", 20, 60);

  doc.text(`Temperature: ${weather.main.temp} °C`, 25, 70);
  doc.text(`Humidity: ${weather.main.humidity}%`, 25, 80);
  doc.text(`Condition: ${weather.weather[0].main}`, 25, 90);

  doc.text("Prediction", 20, 110);

  doc.text(`Disease: ${disease}`, 25, 120);
  doc.text(`Confidence: ${confidence}%`, 25, 130);

  doc.text("Description", 20, 150);

  doc.text(info.description, 25, 160, {
    maxWidth: 160,
  });

  let y = 185;

  doc.text("Treatment", 20, y);

  y += 10;

  info.treatment.forEach((item) => {
    doc.text(`• ${item}`, 25, y);
    y += 8;
  });

  y += 8;

  doc.text("AI Farming Advisory", 20, y);

  y += 10;

  advisory.advice.forEach((item) => {
    doc.text(`• ${item}`, 25, y);
    y += 8;
  });

if (weatherAdvice.length > 0) {

  // Start a new page if there isn't enough space
  if (y > 220) {
    doc.addPage();
    y = 20;
  }

  doc.text("Weather Based AI Recommendation", 20, y);
  y += 10;

  weatherAdvice.forEach((item) => {

    // Add another page if needed
    if (y > 270) {
      doc.addPage();
      y = 20;
    }

    doc.text(`• ${item}`, 25, y);
    y += 8;
  });
}

  doc.save("KrishiMitra_Report.pdf");
};

export default generateReport;