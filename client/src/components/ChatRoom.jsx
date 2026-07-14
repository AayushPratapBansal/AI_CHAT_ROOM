import { useState, useRef } from "react";

function ChatRoom({
  messages,
  systemMessages,
  onSendMessage,
  onTyping,
  onStopTyping,
  typingUser,
}) {
  const [text, setText] = useState("");
  const typingTimeoutRef = useRef(null);

  const handleChange = (e) => {
    setText(e.target.value);
    onTyping();

    clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      onStopTyping();
    }, 1500);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!text.trim()) return;

    clearTimeout(typingTimeoutRef.current);
    onSendMessage(text.trim());
    setText("");
  };

  const allEvents = [
    ...messages.map((m) => ({ ...m, type: "message" })),
    ...systemMessages.map((s) => ({ ...s, type: "system" })),
  ].sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));

  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <h3 className="text-lg font-semibold text-gray-800 mb-3">Chat Room</h3>

      <div className="h-72 overflow-y-auto border border-gray-200 rounded-md p-3 flex flex-col gap-1 bg-gray-50">
        {allEvents.map((event, idx) =>
          event.type === "system" ? (
            <p key={idx} className="text-xs italic text-gray-400 text-center">
              {event.text}
            </p>
          ) : (
            <p key={event._id || idx} className="text-sm text-gray-800">
              <span className="font-semibold text-blue-700">{event.nickname}:</span>{" "}
              {event.text}
            </p>
          )
        )}
      </div>

      {typingUser && (
        <p className="text-xs italic text-gray-500 mt-2">{typingUser} is typing...</p>
      )}

      <form onSubmit={handleSubmit} className="flex gap-2 mt-3">
        <input
          type="text"
          value={text}
          onChange={handleChange}
          placeholder="Type a message..."
          className="flex-1 border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white rounded-md px-4 py-2 text-sm font-medium hover:bg-blue-700 transition-colors"
        >
          Send
        </button>
      </form>
    </div>
  );
}

export default ChatRoom;