import { useState } from "react";

const SERVER_URL = process.env.REACT_APP_SERVER_URL || "http://localhost:5000";

function SummaryBox() {
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSummarize = async () => {
    setLoading(true);
    setSummary("");
    try {
      const res = await fetch(`${SERVER_URL}/api/summary`, {
        method: "POST",
      });
      const data = await res.json();
      setSummary(data.summary || data.error || "No summary available");
    } catch (err) {
      setSummary("Failed to fetch summary");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h3>Summarize Recent Chat</h3>
      <button onClick={handleSummarize} disabled={loading}>
        {loading ? "loading the Summary..." : "Summarize last 20-30 messages"}
      </button>
      {loading && <p>Loading summary...</p>}
      {summary && !loading && <p>{summary}</p>}
    </div>
  );
}

export default SummaryBox;