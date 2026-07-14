import { useEffect, useState } from "react";
import socket from "./socket";
import NicknameEntry from "./components/NicknameEntry";
import ChatRoom from "./components/ChatRoom";
import SummaryBox from "./components/SummaryBox";
import SearchBox from "./components/SearchBox";

function App() {
  const [nickname, setNickname] = useState("");
  const [joined, setJoined] = useState(false);
  const [messages, setMessages] = useState([]);
  const [systemMessages, setSystemMessages] = useState([]);
  const [typingUser, setTypingUser] = useState(null);

  useEffect(() => {
    socket.on("chatHistory", (history) => setMessages(history));
    socket.on("newMessage", (message) => setMessages((prev) => [...prev, message]));
    socket.on("systemMessage", (text) =>
      setSystemMessages((prev) => [...prev, { text, createdAt: new Date().toISOString() }])
    );
    socket.on("errorMessage", (msg) => console.error("Server error:", msg));
    socket.on("userTyping", (typingNickname) => setTypingUser(typingNickname));
    socket.on("userStoppedTyping", () => setTypingUser(null));

    return () => {
      socket.off("chatHistory");
      socket.off("newMessage");
      socket.off("systemMessage");
      socket.off("errorMessage");
      socket.off("userTyping");
      socket.off("userStoppedTyping");
      socket.disconnect();
    };
  }, []);

  const handleJoin = (name) => {
    setNickname(name);
    socket.connect();
    socket.emit("join", { nickname: name });
    setJoined(true);
  };

  const handleSendMessage = (text) => {
    socket.emit("sendMessage", { text });
    socket.emit("stopTyping");
  };

  const handleTyping = () => socket.emit("typing", { nickname });
  const handleStopTyping = () => socket.emit("stopTyping");

  if (!joined) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <NicknameEntry onJoin={handleJoin} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center py-8 px-4">
      <div className="w-full max-w-2xl">
        <header className="mb-4">
          <h1 className="text-2xl font-bold text-gray-800">Realtime Chatroom</h1>
          <p className="text-sm text-gray-500">
            Logged in as <span className="font-medium text-gray-700">{nickname}</span>
          </p>
        </header>

        <ChatRoom
          messages={messages}
          systemMessages={systemMessages}
          onSendMessage={handleSendMessage}
          onTyping={handleTyping}
          onStopTyping={handleStopTyping}
          typingUser={typingUser}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
          <SummaryBox />
          <SearchBox />
        </div>
      </div>
    </div>
  );
}

export default App;