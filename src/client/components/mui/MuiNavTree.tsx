import React from "react";
import { connect } from "react-redux";
import { IAppState, IFocusState } from "../../model";
import { withRouter } from "react-router-dom";
import { RouteComponentProps } from "react-router";
import { makeStyles } from "@material-ui/core/styles";
import TreeView from "@material-ui/lab/TreeView";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import TreeItem from "@material-ui/lab/TreeItem";
import { IDocGraph, IDocMeta } from "../../../shared/IApiTypes";

const useStyles = makeStyles({
  root: {
    height: 240,
    flexGrow: 1,
    maxWidth: 400,
  },
});

interface IProps extends RouteComponentProps {
  graph: IDocGraph;
  focus: IFocusState;
}

const MuiNavTree = withRouter((props: IProps) => {
  const classes = useStyles();

  function recurse(meta: IDocMeta): JSX.Element[] {
    return (meta.children || []).map((childId) => (
      <TreeItem
        nodeId={childId}
        label={props.graph[childId].title}
        key={childId}
      >
        {recurse(props.graph[childId])}
      </TreeItem>
    ));
  }

  function handleSelect(event: React.MouseEvent, nodeId) {
    // uncomment the following to make chevrons only expand/collapse
    // if ((event.target as Element).classList.contains("MuiTreeItem-label"))
    props.history.push(`/doc/${nodeId}`);
  }

  const selected = [];
  if (props.focus.docRef) selected.push(props.focus.docRef.docId);

  return (
    <TreeView
      className={classes.root}
      defaultCollapseIcon={<ExpandMoreIcon />}
      defaultExpandIcon={<ChevronRightIcon />}
      onNodeSelect={handleSelect}
      selected={selected}
    >
      {recurse(props.graph.db)}
    </TreeView>
  );
});

const mapStateToProps = (state: IAppState) => ({
  graph: state.docs.graph,
  focus: state.focus,
});

export default connect(mapStateToProps, {})(MuiNavTree);
