import { useState } from "react";
import axios from "axios";

function ChatBot({ disease, weather, advisory }) {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");

  const handleAsk = async () => {
  if (!question.trim()) return;

  try {
    const res = await axios.post("http://127.0.0.1:8000/chat", {
      question: question,
      disease: disease,
      weather: weather,
      location: "Wagholi",
      advisory: advisory ? advisory.advice : [],
    });

    setAnswer(res.data.answer);
  } catch (err) {
    console.error(err);
    setAnswer("Unable to contact KrishiMitra AI.");
  }
};
  return (
    <div className="chatbot-card">
      <h2>🤖 Ask KrishiMitra AI</h2>

      <input
        type="text"
        placeholder="Ask about your crop..."
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
      />

      <button onClick={handleAsk}>Ask AI</button>

      {answer && (
        <div className="chat-answer">
          <h3>Answer</h3>
          <p>{answer}</p>
        </div>
      )}
    </div>
  );
}

export default ChatBot;