function ConfidenceMeter({ confidence }) {
  const value = Number(confidence);

  let color;
  let message;

  if (value >= 80) {
    color = "green";
    message = "Very High Confidence";
  } else if (value >= 50) {
    color = "orange";
    message = "Medium Confidence";
  } else {
    color = "red";
    message = "Low Confidence";
  }

  return (
    <div className="confidence-meter">
      <div>
        <strong>{value.toFixed(2)}%</strong>

        <span
          className="confidence-dot"
          style={{
            backgroundColor: color,
          }}
        ></span>

        <strong>{message}</strong>
      </div>
    </div>
  );
}

export default ConfidenceMeter;