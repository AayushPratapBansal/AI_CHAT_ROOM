import { useState } from "react";

const SERVER_URL = process.env.REACT_APP_SERVER_URL || "http://localhost:5000";

function SearchBox() {
  const [query, setQuery] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setAnswer("");
    try {
      const res = await fetch(`${SERVER_URL}/api/search`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query }),
      });
      const data = await res.json();
      setAnswer(data.answer || data.error || "No answer available");
    } catch (err) {
      setAnswer("Failed to search messages");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <h3 className="text-lg font-semibold text-gray-800 mb-2">Search Chat History using AI...</h3>
      <form onSubmit={handleSearch} className="flex gap-2">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder='ex-> Who mentioned something?'
          className="flex-1 border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white rounded-md px-4 py-2 text-sm font-medium hover:bg-blue-700 disabled:bg-blue-300 transition-colors"
        >
          {loading ? "Searching..." : "Search"}
        </button>
      </form>
      {loading && <p className="text-xs text-gray-500 mt-2">Loading results...</p>}
      {answer && !loading && (
        <p className="text-sm text-gray-700 mt-3 leading-relaxed">{answer}</p>
      )}
    </div>
  );
}

export default SearchBox;