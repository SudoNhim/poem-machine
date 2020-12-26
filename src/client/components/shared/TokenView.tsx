import { Theme, makeStyles } from "@material-ui/core";
import { Token } from "cohen-db/schema";
import * as React from "react";
import { connect } from "react-redux";
import { RouteComponentProps, withRouter } from "react-router";

import { IDocGraph } from "../../../shared/ApiTypes";
import { SerializeDocRef } from "../../../shared/util";
import { IAppState } from "../../model";

const useStyles = makeStyles((theme: Theme) => ({
  reference: {
    display: "inline",
    cursor: "pointer",
    textDecoration: "underline",
  },
  unresolvedReference: {
    display: "inline",
    cursor: "not-allowed",
    textDecoration: "underline",
    color: theme.palette.error.main,
  },
  link: {
    cursor: "pointer",
    textDecoration: "underline",
    color: theme.palette.primary.main,
  },
  secondary: {
    color: theme.palette.text.secondary,
  },
}));

interface IProps extends RouteComponentProps {
  token: Token;
  graph: IDocGraph;
}

const TokenView: React.FunctionComponent<IProps> = (props) => {
  const classes = useStyles();
  const tok = props.token;
  if (tok.kind === "text") {
    return tok.secondary ? (
      <span className={classes.secondary}>[{tok.text}]</span>
    ) : (
      <span>{tok.text}</span>
    );
  } else if (tok.kind === "link") {
    return (
      <a className={classes.link} href={tok.link}>
        {tok.text || tok.link}
      </a>
    );
  } else {
    const meta = props.graph[tok.reference.documentId];
    if (meta) {
      const handleClick = (evt: React.MouseEvent) => {
        evt.stopPropagation();
        props.history.push(`/doc/${SerializeDocRef(tok.reference)}`);
      };
      return (
        <div className={classes.reference} onClick={handleClick}>
          {meta.title}
        </div>
      );
    } else {
      return (
        <div className={classes.unresolvedReference}>
          #{SerializeDocRef(tok.reference)}
        </div>
      );
    }
  }
};

const mapStateToProps = (state: IAppState, ownProps) => ({
  graph: state.docs.graph,
  token: ownProps.token,
});

export default connect(mapStateToProps, {})(withRouter(TokenView));
