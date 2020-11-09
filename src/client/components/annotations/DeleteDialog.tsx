import { makeStyles } from "@material-ui/core";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import React from "react";
import { connect } from "react-redux";

import { IAnnotation } from "../../../shared/IApiTypes";
import { setDoc } from "../../actions";
import { deleteAnnotation, getDoc } from "../../api";
import { IAppState } from "../../model";
import Annotation from "./Annotation";

const useStyles = makeStyles({
  input: {
    marginBottom: 10,
    marginTop: 10,
  },
  divider: {
    margin: 20,
  },
  kind: {
    fontSize: 14,
    color: "lightGrey",
  },
});

interface IProps {
  docId: string;
  anchor: string;
  annotation: IAnnotation;
  onFinished: () => void;
  setDoc: typeof setDoc;
}

const DeleteDialog: React.FunctionComponent<IProps> = (props) => {
  const classes = useStyles();

  const handleDelete = async () => {
    await deleteAnnotation(props.docId, props.anchor, props.annotation);
    const loaded = await getDoc(props.docId);
    props.setDoc(props.docId, loaded);
    props.onFinished();
  };

  return (
    <div>
      <Dialog
        open={true}
        onClose={() => props.onFinished()}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">Delete Annotation</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this annotation?
          </DialogContentText>
          <Annotation annotation={props.annotation} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => props.onFinished()}>Cancel</Button>
          <Button onClick={() => handleDelete()} color="primary">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

const mapStateToProps = (state: IAppState, ownProps) => ({
  annotation: ownProps.annotation,
  onFinished: ownProps.onFinished,
  docId: state.focus.docId,
  anchor: state.focus.docPart,
});

export default connect(mapStateToProps, { setDoc })(DeleteDialog);
