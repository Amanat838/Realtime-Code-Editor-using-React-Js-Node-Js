import express from "express";
import http from "http";
const app = express();
import { Server } from "socket.io";
import ACTIONS from "./Actions.js";

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

const userSocketMap = {};

function getAllConnectedClients(roomId) {
  return Array.from(io.sockets.adapter.rooms.get(roomId) || []).map(
    (socketId) => {
      return {
        socketId,
        username: userSocketMap[socketId],
      };
    }
  );
}
io.on("connection", (socket) => {
  console.log("socket connected", socket.id);
  socket.on(ACTIONS.JOIN, ({ roomId, username }) => {
    const isNameTaken = Object.values(userSocketMap).includes(username);

    if (isNameTaken) {
      socket.emit("error", { message: "Username already taken" });
      return; // ❌ Stop further execution
    }
    userSocketMap[socket.id] = username;
    socket.join(roomId);
    const clients = getAllConnectedClients(roomId);
    // console.log(clients);
    io.in(roomId).emit(ACTIONS.JOINED, {
      clients,
      username,
      socketId: socket.id,
    });
  });

  socket.on(ACTIONS.CODE_CHANGE, ({ roomId, code }) => {
    // console.log('Recieving', code)
    socket.in(roomId).emit(ACTIONS.CODE_CHANGE, { code });
  });

  
  socket.on(ACTIONS.SYNC_CODE, ({ socketId, code }) => {
    io.to(socketId).emit(ACTIONS.CODE_CHANGE, { code });
  });

  socket.on("disconnect", () => {
    // console.log("❌ Disconnected:", socket.id);
    const rooms = [...socket.rooms];
    delete userSocketMap[socket.id];

    rooms.forEach((roomId) => {
      const clients = getAllConnectedClients(roomId);
      io.in(roomId).emit(ACTIONS.DISCONNECTED, {
        socketId: socket.id,
        clients,
      });
    });
  });

  socket.on("disconnecting", () => {
    const rooms = [...socket.rooms];
    rooms.forEach((roomId) => {
      socket.to(roomId).emit(ACTIONS.DISCONNECTED, {
        socketId: socket.id,
        username: userSocketMap[socket.id],
      });
    });
    delete userSocketMap[socket.id];
    socket.leave();
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Listening on port ${PORT}`));
