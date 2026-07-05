import { useState } from "react";

function NicknameEntry({ onJoin }) {
  const [nickname, setNickname] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!nickname.trim()) return;
    onJoin(nickname.trim());
  };

  return (
    <div>
      <h2>Enter a nickname to join the chat</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
          placeholder="Your nickname"
        />
        <button type="submit">Join Chat</button>
      </form>
    </div>
  );
}

export default NicknameEntry;
