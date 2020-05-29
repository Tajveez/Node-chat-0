const express = require("express");
const path = require("path");
const http = require("http");
const socketio = require("socket.io");
const app = express();
const formatMessage = require("./utils/messages");
const {
  userJoin,
  getCurrentUser,
  leaveChat,
  getRoomUsers,
} = require("./utils/users");

// Creating HTTP server for Socket.io to Use, although express already uses Http server under the hood
const server = http.createServer(app);

// connecting Socket with our server
const io = socketio(server);

const botName = "ChattifyBot";
// Run when Client connects
io.on("connect", (socket) => {
  console.log("New WS Connection...");

  // Listening to joinRoom event from client-side
  socket.on("joinRoom", ({ username, room }) => {
    const user = userJoin(socket.id, username, room);

    socket.join(user.room);
    // Emitting a socket event on new connection.
    // * this will emit to only the user that's connecting
    socket.emit(
      "message",
      formatMessage(botName, "Welcome to ChatApp", "notification")
    );

    // Broadcasting
    // * this will broadcast to everybody expect the user that connecting
    socket.broadcast
      .to(user.room)
      .emit(
        "message",
        formatMessage(
          botName,
          `${(user, username)} has joined the chat.`,
          "notification"
        )
      );

    io.to(user.room).emit("roomUsers", {
      room: user.room,
      users: getRoomUsers(user.room),
    });
  });

  // Listening to chatMessage
  socket.on("chatMessage", (chatMessage) => {
    console.log(chatMessage);
    const user = getCurrentUser(socket.id);
    io.to(user.room).emit(
      "message",
      formatMessage(user.username, chatMessage, "message")
    );
  });

  // * this will emit to everybody
  // io.emit()

  // Listening to disconnect event
  socket.on("disconnect", () => {
    const user = leaveChat(socket.id);
    if (user) {
      io.to(user.room).emit(
        "message",
        formatMessage(
          botName,
          `${user.username} has left the chat`,
          "notification"
        )
      );
      io.to(user.room).emit("roomUsers", {
        room: user.room,
        users: getRoomUsers(user.room),
      });
    }
  });
});

app.use(express.static(path.join(__dirname, "public")));

const PORT = 3000 || process.env.PORT;
server.listen(PORT, () => {
  console.log(`server running on port: ${PORT}`);
});
