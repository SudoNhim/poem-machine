import { Paper } from "@material-ui/core";
import * as React from "react";
import io from "socket.io-client";

import { IChatMessage } from "../../shared/IApiTypes";

const Chat: React.FunctionComponent = () => {
  const [chatLog, setChatLog] = React.useState<IChatMessage[]>([]);

  React.useEffect(() => {
    console.log("setting up socket connection");
    const socket = io();
    socket.on("init", (messages: IChatMessage[]) => {
      setChatLog(messages.reverse());
    });

    socket.on("push", (message: IChatMessage) => {
      setChatLog([...chatLog, message]);
    });
  }, []);

  return (
    <Paper>
      This is the chat page.
      {chatLog.map((message, i) => (
        <p key={i}>{JSON.stringify(message)}</p>
      ))}
    </Paper>
  );
};

export default Chat;
