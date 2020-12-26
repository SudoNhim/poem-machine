import { Paper, TextField, Theme, makeStyles } from "@material-ui/core";
import * as React from "react";
import { connect } from "react-redux";

import { IChatMessage } from "../../../shared/ApiTypes";
import { IAppState } from "../../model";
import { textToTokens } from "../../util";
import ChatMessage from "./ChatMessage";

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    display: "flex",
    flexDirection: "column-reverse",
    overflowY: "scroll",
  },
  input: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
  },
  paper: {
    // flex: 1,
    padding: theme.spacing(2),
  },
}));

interface IProps {
  messages: IChatMessage[];
  username: string;
  postMessage: (message: IChatMessage) => void;
}

const ChatView: React.FunctionComponent<IProps> = (props) => {
  const classes = useStyles();

  const [newMessage, setNewMessage] = React.useState("");

  const handleSubmit = (
    evt: React.FormEvent<HTMLFormElement> | React.KeyboardEvent<HTMLDivElement>
  ) => {
    const message: IChatMessage = {
      user: props.username,
      tokens: textToTokens(newMessage),
    };
    props.postMessage(message);
    setNewMessage("");
    evt.preventDefault();
  };

  const rootRef = React.createRef<HTMLDivElement>();
  const scrollToBottom = () => {
    if (rootRef.current)
      rootRef.current.scrollTop = rootRef.current.scrollHeight;
  };

  const handleKeyPress = (evt: React.KeyboardEvent<HTMLDivElement>) => {
    if (evt.key === "Enter" && evt.shiftKey === false) handleSubmit(evt);
    scrollToBottom();
  };

  // When a new message arrives also scroll to bottom (if chat ever gets active this may
  // need to be reworked)
  React.useEffect(scrollToBottom, [props.messages, rootRef.current]);

  return (
    <div className={classes.root} ref={rootRef}>
      <Paper className={classes.paper}>
        {props.messages.map((msg, i) => (
          <ChatMessage message={msg} key={i} />
        ))}
        <form onSubmit={handleSubmit}>
          <TextField
            className={classes.input}
            placeholder={`Comment as ${props.username}`}
            fullWidth={true}
            multiline={true}
            value={newMessage}
            onChange={(evt) => setNewMessage(evt.target.value)}
            onKeyPress={handleKeyPress}
          />
        </form>
      </Paper>
    </div>
  );
};

const mapStateToProps = (state: IAppState, ownProps) => ({
  messages: ownProps.messages,
  postMessage: ownProps.postMessage,
  username: state.user.username || "anonymous",
});

export default connect(mapStateToProps)(ChatView);
