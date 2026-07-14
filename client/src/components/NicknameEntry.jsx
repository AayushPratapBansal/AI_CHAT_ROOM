import { useState } from "react";

function NicknameEntry({ onJoin }) {
  const [nickname, setNickname] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!nickname.trim()) return;
    onJoin(nickname.trim());
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-8 w-full max-w-sm">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">
        Enter a nickname to join the chat
      </h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <input
          type="text"
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
          placeholder="Your nickname"
          className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white rounded-md px-4 py-2 text-sm font-medium hover:bg-blue-700 transition-colors"
        >
          Join Chat
        </button>
      </form>
    </div>
  );
}

export default NicknameEntry;