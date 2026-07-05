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
    <div>
      <h3>Search Chat History</h3>
       <input type="text"  value={query}  onChange={(e) => setQuery(e.target.value)}
    placeholder="Enter your query here to search..."
  />
  <button onClick={handleSearch} >
    {loading ? "Searching..." : "Search"}
  </button>
      {loading && <p>Loading results...</p>}
      {answer && !loading && <p>{answer}</p>}
    </div>
  );
}

export default SearchBox;