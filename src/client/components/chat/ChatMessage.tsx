import { Typography, makeStyles } from "@material-ui/core";
import * as React from "react";

import { IChatMessage } from "../../../shared/ApiTypes";
import ContentToken from "../shared/ContentToken";

const useStyles = makeStyles({
  content: {
    fontSize: 14,
  },
  contentContainer: {
    paddingTop: 10,
    paddingBottom: 10,
  },
  userTag: {
    color: "grey",
    fontSize: 14,
  },
});

interface IProps {
  message: IChatMessage;
}

const ChatMessage: React.FunctionComponent<IProps> = (props) => {
  const classes = useStyles();

  return (
    <React.Fragment>
      <div className={classes.contentContainer}>
        <Typography
          className={classes.userTag}
          color="textSecondary"
          component="span"
        >
          {props.message.user || "anonymous"}:&nbsp;
        </Typography>
        <Typography className={classes.content} component="span">
          {props.message.content.map((tok, i) => (
            <ContentToken token={tok} key={i} />
          ))}
        </Typography>
      </div>
    </React.Fragment>
  );
};

export default ChatMessage;
