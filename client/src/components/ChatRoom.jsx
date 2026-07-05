import { useState } from "react";

function ChatRoom({ messages, systemMessages, onSendMessage }) {
  const [text, setText] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    onSendMessage(text.trim());
    setText("");
  };

  const allEvents = [
    ...messages.map((m) => ({ ...m, type: "message" })),
    ...systemMessages.map((s) => ({ ...s, type: "system" })),
  ].sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));

  return (
    <div>
      <h3>Chat Room</h3>

      <div style={{ height: "300px", overflowY: "auto", border: "1px solid #ccc" }}>
        {allEvents.map((event, idx) =>
          event.type === "system" ? (
            <p key={idx}>
              <em>{event.text}</em>
            </p>
          ) : (
            <p key={event._id || idx}>
              <strong>{event.nickname}:</strong> {event.text}
            </p>
          )
        )}
      </div>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type a message..."
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
}

export default ChatRoom;
