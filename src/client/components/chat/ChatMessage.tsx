import { Typography, makeStyles } from "@material-ui/core";
import * as React from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";

import {
  IChatMessage,
  IContentToken,
  IDocGraph,
} from "../../../shared/IApiTypes";
import { IAppState } from "../../model";

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
  link: {
    textDecoration: "underline",
  },
  externalLink: {
    textDecoration: "underline",
    color: "darkblue",
  },
});

interface IProps {
  message: IChatMessage;
  graph: IDocGraph;
}

const ChatMessage: React.FunctionComponent<IProps> = (props) => {
  const classes = useStyles();

  const renderToken = (tok: IContentToken, key: number) => {
    if (tok.kind === "docref")
      return (
        <Link
          to={`/doc/${tok.docRef}`}
          key={key}
          onClick={(e) => e.stopPropagation()}
        >
          <span className={classes.link}>
            {props.graph[tok.docRef] ? (
              props.graph[tok.docRef].title
            ) : (
              <span style={{ color: "red" }}>{tok.docRef}</span>
            )}
          </span>
        </Link>
      );
    else if (tok.kind === "link")
      return (
        <a
          className={classes.externalLink}
          href={tok.link}
          onClick={(e) => e.stopPropagation()}
          key={key}
        >
          {tok.text}
        </a>
      );
    else {
      const lines = tok.text.split("\n");
      return (
        <React.Fragment key={key}>
          {lines.map((s, i) =>
            i === lines.length - 1 ? (
              <span key={i}>{s}</span>
            ) : (
              <React.Fragment>
                <span key={i}>{s}</span>
                <br />
              </React.Fragment>
            )
          )}
        </React.Fragment>
      );
    }
  };

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
          {props.message.content.map((tok, i) => renderToken(tok, i))}
        </Typography>
      </div>
    </React.Fragment>
  );
};

const mapStateToProps = (state: IAppState, ownProps) => ({
  annotation: ownProps.annotation,
  isPreview: ownProps.isPreview || false,
  graph: state.docs.graph,
});

export default connect(mapStateToProps)(ChatMessage);
