import { useEffect, useState } from "react";
import api from "../services/api";

function History({ refresh }) {
  const [history, setHistory] = useState([]);

  // Fetch prediction history
  const fetchHistory = async () => {
    try {
      const res = await api.get("/history");
      setHistory(res.data.predictions);
    } catch (err) {
      console.error("Error fetching history:", err);
    }
  };

  // Delete all history
  const deleteHistory = async () => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete all prediction history?"
    );

    if (!confirmDelete) return;

    try {
      await api.delete("/history");
      fetchHistory();
    } catch (err) {
      console.error("Error deleting history:", err);
    }
  };

  // Fetch history on component load and whenever refresh changes
  useEffect(() => {
  const loadHistory = async () => {
    try {
      const res = await api.get("/history");
      setHistory(res.data.predictions);
    } catch (err) {
      console.error(err);
    }
  };

  loadHistory();
}, [refresh]);

  return (
    <div className="history-card">
      <h2>📜 Prediction History</h2>

      <button
        onClick={deleteHistory}
        style={{
          backgroundColor: "#dc3545",
          color: "white",
          border: "none",
          padding: "10px 15px",
          borderRadius: "5px",
          cursor: "pointer",
          marginBottom: "15px",
        }}
      >
        🗑 Delete History
      </button>

      {history.length === 0 ? (
        <p>No predictions yet.</p>
      ) : (
        history.map((item, index) => (
          <div key={index} className="history-item">
            <h3>{item.disease}</h3>

            <p>
              <strong>Confidence:</strong> {item.confidence}%
            </p>

            <p>
              <strong>Date:</strong>{" "}
              {new Date(item.timestamp).toLocaleString()}
            </p>

            <hr />
          </div>
        ))
      )}
    </div>
  );
}

export default History;