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
        headers: { "Content-Type": "application/json" },
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
    <div className="bg-white rounded-lg shadow-md p-4">
      <h3 className="text-lg font-semibold text-gray-800 mb-2">Summarize Recent Chat Using GROQ AI...</h3>
      <button
        onClick={handleSummarize}
        disabled={loading}
        className="bg-emerald-600 text-white rounded-md px-4 py-2 text-sm font-medium hover:bg-emerald-700 disabled:bg-emerald-300 transition-colors"
      >
        {loading ? "Summarizing..." : "Summarize last 20-30 messages"}
      </button>
      {loading && <p className="text-xs text-gray-500 mt-2">Loading summary...</p>}
      {summary && !loading && (
        <p className="text-sm text-gray-700 mt-3 leading-relaxed">{summary}</p>
      )}
    </div>
  );
}

export default SummaryBox;