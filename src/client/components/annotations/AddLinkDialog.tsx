import { Divider, makeStyles } from "@material-ui/core";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import TextField from "@material-ui/core/TextField";
import React from "react";

import DocumentChoiceInput from "../shared/DocumentChoiceInput";

const useStyles = makeStyles({
  input: {
    marginBottom: 10,
    marginTop: 10,
  },
  divider: {
    margin: 20,
  },
});

interface IProps {
  isOpen: boolean;
  handleSubmit: (str: string) => void;
}

const AddLinkDialog: React.FunctionComponent<IProps> = (props) => {
  const classes = useStyles();

  const [urlText, setUrlText] = React.useState("");
  const [urlDisplayText, setUrlDisplayText] = React.useState("");
  const [documentId, setDocumentId] = React.useState<string | null>(null);

  // wipe on open/close
  React.useEffect(() => {
    setUrlText("");
    setUrlDisplayText("");
    setDocumentId(null);
  }, [props.isOpen]);

  const handleInsert = () => {
    if (documentId) props.handleSubmit(`#${documentId}`);
    else if (urlText) props.handleSubmit(`[${urlDisplayText}](${urlText})`);
    else props.handleSubmit(urlDisplayText);
  };

  const documentChoiceDisabled = !!urlText || !!urlDisplayText;

  return (
    <div>
      <Dialog
        open={props.isOpen}
        onClose={handleInsert}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">Add Link</DialogTitle>
        <DialogContent>
          <DialogContentText>Link to a URL</DialogContentText>
          <TextField
            className={classes.input}
            size="small"
            fullWidth={true}
            label="External link, e.g. 'https://en.wiki..."
            variant="outlined"
            type="url"
            value={urlText}
            onChange={(evt) => setUrlText(evt.target.value)}
            disabled={!!document}
          />
          <TextField
            className={classes.input}
            size="small"
            fullWidth={true}
            label="Display text, e.g. 'wiki article'"
            variant="outlined"
            value={urlDisplayText}
            onChange={(evt) => setUrlDisplayText(evt.target.value)}
            disabled={!!document}
          />
          <Divider className={classes.divider} />
          <DialogContentText>
            Or, link to another document in the site
          </DialogContentText>
          <DocumentChoiceInput
            onChange={setDocumentId}
            disabled={documentChoiceDisabled}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => props.handleSubmit("")} color="primary">
            Cancel
          </Button>
          <Button onClick={handleInsert} color="primary">
            Insert
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default AddLinkDialog;
