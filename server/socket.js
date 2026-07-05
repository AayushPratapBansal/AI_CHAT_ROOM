const Message = require("./models/Message");

function setupSocket(io) {
  io.on("connection", (socket) => {
    console.log("New client connected:", socket.id);

    socket.on("join", async (data) => {
      const nickname = data.nickname;
      socket.data.nickname = nickname;

      try {
        const history = await Message.find({})
          .sort({ createdAt: 1 })
          .limit(100)
          .lean();

        socket.emit("chatHistory", history);
        socket.broadcast.emit("systemMessage", nickname + " joined the room");
      } catch (error) {
        console.log("Error loading chat history:", error.message);
        socket.emit("errorMessage", "Could not load chat history");
      }
    });

    socket.on("sendMessage", async (data) => {
      const text = data.text;
      let nickname = socket.data.nickname;
      if (!nickname) {
        nickname = "DUMMY_CODER";
      }

      try {
        const newMessage = await Message.create({
          nickname: nickname,
          text: text,
        });

        io.emit("newMessage", {
          _id: newMessage._id,
          nickname: newMessage.nickname,
          text: newMessage.text,
          createdAt: newMessage.createdAt,
        });
      } catch (error) {
        console.log("Error saving message:", error.message);
        socket.emit("errorMessage", "Message failed to send");
      }
    });

    socket.on("disconnect", function () {
      console.log("Client disconnected:", socket.id);
      if (socket.data.nickname) {
        socket.broadcast.emit(
          "systemMessage",
          socket.data.nickname + " left the room",
        );
      }
      socket.removeAllListeners();
    });
  });
}

module.exports = setupSocket;
