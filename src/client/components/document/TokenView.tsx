import { Theme, makeStyles } from "@material-ui/core";
import { Token } from "cohen-db/schema";
import * as React from "react";
import { connect } from "react-redux";
import { RouteComponentProps, withRouter } from "react-router";

import { IDocGraph } from "../../../shared/ApiTypes";
import { IAppState } from "../../model";

const useStyles = makeStyles((theme: Theme) => ({
  reference: {
    display: "inline",
    cursor: "pointer",
    textDecoration: "underline",
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
    return <span>{tok.text}</span>;
  } else if (tok.kind === "link") {
    return <a href={tok.link}>{tok.text || tok.link}</a>;
  } else {
    const meta = props.graph[tok.reference.documentId];
    const handleClick = (evt: React.MouseEvent) => {
      evt.stopPropagation();
      props.history.push(`/doc/${tok.reference.documentId}`);
    };
    return (
      <div className={classes.reference} onClick={handleClick}>
        {meta.title}
      </div>
    );
  }
};

const mapStateToProps = (state: IAppState, ownProps) => ({
  graph: state.docs.graph,
  token: ownProps.token,
});

export default connect(mapStateToProps, {})(withRouter(TokenView));
