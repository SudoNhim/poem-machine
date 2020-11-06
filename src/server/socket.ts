import http from "http";

import { Socket, Server as SocketIOServer } from "socket.io";

import { ChatMessage, IChatMessage } from "./models/ChatMessage";

import _socketio = require("socket.io");

const socketio = (_socketio as unknown) as (
  server: http.Server
) => SocketIOServer;

export function setupSocketIo(server: http.Server) {
  socketio(server).on("connection", (socket: Socket) => {
    // Get the last 50 messages from the database.
    ChatMessage.find()
      .sort({ createdAt: -1 })
      .limit(50)
      .exec((err, messages) => {
        if (err) return console.error(err);

        // Send the last messages to the user.
        socket.emit(
          "init",
          messages.map((msg) => msg.toObject())
        );
      });

    // Listen to connected users for a new message.
    socket.on("message", (msg: IChatMessage) => {
      // Create a message with the content and the name of the user.
      const message = new ChatMessage({
        user: msg.user,
        content: msg.content,
      });

      // Save the message to the database.
      message.save((err) => {
        throw err;
      });

      // Notify all other users about a new message.
      socket.broadcast.emit("push", msg);
    });
  });
}
