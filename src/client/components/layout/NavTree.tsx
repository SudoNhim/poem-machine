import { Divider } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import TreeItem from "@material-ui/lab/TreeItem";
import TreeView from "@material-ui/lab/TreeView";
import React from "react";
import { connect } from "react-redux";
import { RouteComponentProps } from "react-router";
import { withRouter } from "react-router-dom";

import { IDocGraph, IDocMeta } from "../../../shared/ApiTypes";
import { IAppState, IFocusState } from "../../model";

const useStyles = makeStyles({
  root: {
    marginTop: 10,
    height: 240,
    flexGrow: 1,
    maxWidth: 400,
  },
  divider: {
    marginTop: 6,
    marginBottom: 6,
  },
});

interface IProps extends RouteComponentProps {
  graph: IDocGraph;
  focus: IFocusState;
}

const NavTree = withRouter((props: IProps) => {
  const classes = useStyles();

  function recurse(meta: IDocMeta): JSX.Element[] {
    return (meta.children || []).map((childId) => (
      <TreeItem
        nodeId={`/doc/${childId}`}
        label={props.graph[childId].title}
        key={childId}
      >
        {recurse(props.graph[childId])}
      </TreeItem>
    ));
  }

  function handleSelect(event: React.MouseEvent, nodeId) {
    // uncomment the following to make chevrons only expand/collapse
    if ((event.target as Element).classList.contains("MuiTreeItem-label"))
      props.history.push(nodeId);
  }

  const selected = [];
  if (props.focus.docId) selected.push(props.focus.docId);

  return (
    <TreeView
      className={classes.root}
      defaultCollapseIcon={<ExpandMoreIcon />}
      defaultExpandIcon={<ChevronRightIcon />}
      onNodeSelect={handleSelect}
      selected={selected}
    >
      <TreeItem nodeId="/" label="Home" key="home" />
      <Divider className={classes.divider} />
      <TreeItem nodeId="/chat" label="Chat" key="chat" />
      <Divider className={classes.divider} />
      {recurse(props.graph.db)}
    </TreeView>
  );
});

const mapStateToProps = (state: IAppState) => ({
  graph: state.docs.graph,
  focus: state.focus,
});

export default connect(mapStateToProps, {})(NavTree);
