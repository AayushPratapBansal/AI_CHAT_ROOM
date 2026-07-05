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
  useEffect(() => {
    socket.on("chatHistory", (history) => {
      setMessages(history);
    });

    socket.on("newMessage", (message) => {
      setMessages((prev) => [...prev, message]);
    });

    socket.on("systemMessage", (text) => {
      setSystemMessages((prev) => [
        ...prev,
        { text, createdAt: new Date().toISOString() },
      ]);
    });

    socket.on("errorMessage", (msg) => {
      console.error("Server error:", msg);
    });

    
    return () => {
      socket.off("chatHistory");
      socket.off("newMessage");
      socket.off("systemMessage");
      socket.off("errorMessage");
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
  };

  if (!joined) {
    return <NicknameEntry onJoin={handleJoin} />;
  }

  return (
    <div>
      <h1>Realtime Chatroom</h1>
      <p>Logged in as: {nickname}</p>

      <ChatRoom
        messages={messages}
        systemMessages={systemMessages}
        onSendMessage={handleSendMessage}
      />

      <SummaryBox />
      <SearchBox />
    </div>
  );
}

export default App;