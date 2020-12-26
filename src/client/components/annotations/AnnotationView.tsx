import { Divider, IconButton, Typography, makeStyles } from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";
import { Annotation } from "cohen-db/schema";
import * as React from "react";
import { connect } from "react-redux";

import { IAppState } from "../../model";
import TokenView from "../shared/TokenView";

const useStyles = makeStyles({
  content: {
    fontSize: 14,
  },
  contentContainer: {
    paddingTop: 10,
    paddingBottom: 10,
  },
  highlight: {
    backgroundColor: "lightyellow",
  },
  previewTag: {
    color: "darkblue",
    fontSize: 14,
    textAlign: "center",
    marginBottom: 5,
  },
  userTag: {
    color: "grey",
    fontSize: 14,
  },
  buttons: {
    display: "inline-block",
  },
});

interface IProps {
  annotation: Annotation;
  isPreview: boolean;
  allowEdit: boolean;
  onEdit: () => void;
  onDelete: () => void;
  username: string;
}

const AnnotationView: React.FunctionComponent<IProps> = (props) => {
  const classes = useStyles();

  const containerClasses = props.isPreview
    ? [classes.contentContainer, classes.highlight]
    : [classes.contentContainer];

  return (
    <React.Fragment>
      <Divider />
      <div className={containerClasses.join(" ")}>
        {props.isPreview && (
          <Typography className={classes.previewTag}>preview</Typography>
        )}
        <Typography
          className={classes.userTag}
          color="textSecondary"
          component="span"
        >
          {props.annotation.user || "anonymous"}:&nbsp;
        </Typography>
        <Typography className={classes.content} component="span">
          {props.annotation.tokens.map((tok, i) => (
            <TokenView token={tok} key={i} />
          ))}
        </Typography>
        {props.allowEdit &&
          (props.username == props.annotation.user ||
            props.annotation.user === "anonymous") && (
            <div className={classes.buttons}>
              <IconButton size="small" onClick={() => props.onEdit()}>
                <EditIcon color="primary" fontSize="small" />
              </IconButton>
              <IconButton size="small" onClick={() => props.onDelete()}>
                <DeleteIcon color="primary" fontSize="small" />
              </IconButton>
            </div>
          )}
      </div>
    </React.Fragment>
  );
};

const mapStateToProps = (state: IAppState, ownProps) => ({
  annotation: ownProps.annotation,
  isPreviw: ownProps.isPreview,
  allowEdit: ownProps.allowEdit,
  onEdit: ownProps.onEdit,
  onDelete: ownProps.onDelete,
  username: state.user.username,
});

export default connect(mapStateToProps)(AnnotationView);
