import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

function ConfidenceMeter({ confidence }) {
  return (
    <div
      style={{
        width: 180,
        height: 180,
        margin: "20px auto",
      }}
    >
      <CircularProgressbar
        value={confidence}
        text={`${confidence}%`}
        styles={buildStyles({
          textSize: "14px",
          pathColor:
            confidence >= 90
              ? "#2e7d32"
              : confidence >= 75
              ? "#f9a825"
              : "#d32f2f",
          textColor: "#222",
          trailColor: "#eee",
        })}
      />
    </div>
  );
}

export default ConfidenceMeter;