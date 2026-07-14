const Message = require("./models/Message");

function setupSocket(io) {
  io.on("connection", (socket) => {
    console.log("New client connected:", socket.id);

    socket.on("join", async ({ nickname }) => {
      socket.data.nickname = nickname;

      try {
        const history = await Message.find({})
          .sort({ createdAt: 1 })
          .limit(100)
          .lean();

        socket.emit("chatHistory", history);
        socket.broadcast.emit("systemMessage", `${nickname} joined the room`);
      } catch (err) {
        console.error("Error loading chat history:", err.message);
        socket.emit("errorMessage", "Could not load chat history");
      }
    });

    socket.on("sendMessage", async ({ text }) => {
      const nickname = socket.data.nickname || "Anonymous";

      try {
        const newMessage = await Message.create({ nickname, text });

        io.emit("newMessage", {
          _id: newMessage._id,
          nickname: newMessage.nickname,
          text: newMessage.text,
          createdAt: newMessage.createdAt,
        });
      } catch (err) {
        console.error("Error saving message:", err.message);
        socket.emit("errorMessage", "Message failed to send");
      }
    });

    // ⬅ NEW block starts here
    socket.on("typing", ({ nickname }) => {
      // ⬅ NEW
      socket.broadcast.emit("userTyping", nickname); // ⬅ NEW
    }); // ⬅ NEW

    socket.on("stopTyping", () => {
      // ⬅ NEW
      socket.broadcast.emit("userStoppedTyping"); // ⬅ NEW
    }); // ⬅ NEW
    // ⬅ NEW block ends here

    socket.on("disconnect", () => {
      console.log("Client disconnected:", socket.id);
      if (socket.data.nickname) {
        socket.broadcast.emit(
          "systemMessage",
          `${socket.data.nickname} left the room`,
        );
      }
      socket.removeAllListeners();
    });
  });
}

module.exports = setupSocket;
