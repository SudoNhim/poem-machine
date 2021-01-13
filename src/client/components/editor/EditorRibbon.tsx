import { Paper } from "@material-ui/core";
import IconButton from "@material-ui/core/IconButton";
import { Theme, createStyles, makeStyles } from "@material-ui/core/styles";
import Toolbar from "@material-ui/core/Toolbar";
import RedoIcon from "@material-ui/icons/Redo";
import SaveIcon from "@material-ui/icons/Save";
import UndoIcon from "@material-ui/icons/Undo";
import React from "react";
import { connect } from "react-redux";
import { RouteComponentProps } from "react-router";
import { withRouter } from "react-router-dom";

import { IAppState } from "../../model";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      position: "fixed",
      left: theme.spacing(1),
      right: theme.spacing(1),
      zIndex: 5,
    },
    buttonLeft: {},
    buttonRight: {
      position: "absolute",
      right: theme.spacing(2),
    },
  })
);

interface IProps extends RouteComponentProps {
  onUndo: () => void;
  undoDisabled: boolean;
  onRedo: () => void;
  redoDisabled: boolean;
  onSave: () => void;
  saveDisabled: boolean;
}

const EditorRibbon = withRouter((props: IProps) => {
  const classes = useStyles();

  return (
    <Paper className={classes.container} elevation={2}>
      <Toolbar variant="dense">
        <IconButton
          className={classes.buttonLeft}
          size="small"
          onClick={props.onUndo}
          disabled={props.undoDisabled}
        >
          <UndoIcon fontSize="small" />
        </IconButton>
        <IconButton
          className={classes.buttonLeft}
          size="small"
          onClick={props.onRedo}
          disabled={props.redoDisabled}
        >
          <RedoIcon fontSize="small" />
        </IconButton>
        <IconButton
          className={classes.buttonRight}
          size="small"
          color="primary"
          onClick={props.onSave}
          disabled={props.saveDisabled}
        >
          <SaveIcon fontSize="small" />
        </IconButton>
      </Toolbar>
    </Paper>
  );
});

const mapStateToProps = (state: IAppState, ownProps) => ({
  username: state.user.username,
  openSideBar: ownProps.openSideBar,
});

export default connect(mapStateToProps)(EditorRibbon);
