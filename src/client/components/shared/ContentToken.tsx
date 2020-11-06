import { makeStyles } from "@material-ui/core";
import * as React from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";

import { IContentToken, IDocGraph } from "../../../shared/IApiTypes";
import { IAppState } from "../../model";

const useStyles = makeStyles({
  link: {
    textDecoration: "underline",
  },
  externalLink: {
    textDecoration: "underline",
    color: "darkblue",
  },
});

interface IProps {
  graph: IDocGraph;
  token: IContentToken;
}

const ContentToken: React.FunctionComponent<IProps> = (props) => {
  const classes = useStyles();
  const tok = props.token;
  if (tok.kind === "docref")
    return (
      <Link to={`/doc/${tok.docRef}`} onClick={(e) => e.stopPropagation()}>
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
      >
        {tok.text}
      </a>
    );
  else {
    const lines = tok.text.split("\n");
    return (
      <React.Fragment>
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

const mapStateToProps = (state: IAppState, ownProps) => ({
  token: ownProps.token,
  graph: state.docs.graph,
});

export default connect(mapStateToProps)(ContentToken);
