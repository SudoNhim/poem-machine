import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import TextField from "@material-ui/core/TextField";
import React from "react";
import { connect } from "react-redux";

import { IDocGraph } from "../../../shared/IApiTypes";
import { IAppState } from "../../model";

interface IProps {
  graph: IDocGraph;
  isOpen: boolean;
  handleSubmit: (str: string) => void;
}

const AddLinkDialog: React.FunctionComponent<IProps> = (props) => {
  const [text, setText] = React.useState("");

  const handleInsert = () => {
    props.handleSubmit(text);
  };

  return (
    <div>
      <Dialog
        open={props.isOpen}
        onClose={handleInsert}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">Add Link</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Insert a link, either to a URL, or to another document in this site.
          </DialogContentText>
          <TextField
            autoFocus
            fullWidth
            value={text}
            onChange={(evt) => setText(evt.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleInsert} color="primary">
            Insert
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

const mapStateToProps = (state: IAppState, ownProps) => ({
  graph: state.docs.graph,
  isOpen: ownProps.isOpen,
  handleSubmit: ownProps.handleSubmit,
});

export default connect(mapStateToProps)(AddLinkDialog);
