import * as React from "react";
import io from "socket.io-client";

import { IChatMessage } from "../../shared/ApiTypes";
import ChatView from "./chat/ChatView";

const ChatPage: React.FunctionComponent = () => {
  const [chatLog, setChatLog] = React.useState<IChatMessage[]>([]);

  React.useEffect(() => {
    const socket = io();
    socket.on("init", (messages: IChatMessage[]) => {
      setChatLog([...messages]);
      socket.on("push", (message: IChatMessage) => {
        messages.push(message);
        setChatLog([...messages]);
      });
    });
  }, []);

  const sendMessage = (message: IChatMessage) => {
    io().emit("chat message", message);
  };

  return <ChatView messages={[...chatLog]} postMessage={sendMessage} />;
};

export default ChatPage;
