import express from "express";
import http from "http";
import { Server } from "socket.io";

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static("public"));


io.on("connection", socket => {
  console.log("A user connected");

  socket.on("pixel_update_sent", data => {
    socket.broadcast.emit('pixel_update_message', data)    
  });

  socket.on("disconnect", () => console.log("A user disconnected"));
});

// Start server
server.listen(3000, () => console.log("Server running"));
