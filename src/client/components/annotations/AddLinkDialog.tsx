import { Divider, makeStyles } from "@material-ui/core";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";
import React from "react";
import { connect } from "react-redux";

import { IDocGraph } from "../../../shared/IApiTypes";
import { IAppState } from "../../model";

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
  graph: IDocGraph;
  isOpen: boolean;
  handleSubmit: (str: string) => void;
}

interface IDocumentOption {
  docId: string;
  title: string;
  kind: string;
}

const AddLinkDialog: React.FunctionComponent<IProps> = (props) => {
  const classes = useStyles();

  const [urlText, setUrlText] = React.useState("");
  const [urlDisplayText, setUrlDisplayText] = React.useState("");
  const [document, setDocument] = React.useState<string | IDocumentOption>(
    null
  );

  // wipe on open/close
  React.useEffect(() => {
    setUrlText("");
    setUrlDisplayText("");
    setDocument(null);
  }, [props.isOpen]);

  const handleInsert = () => {
    if (document && typeof document !== "string")
      props.handleSubmit(`#${document.docId}`);
    else if (urlText) props.handleSubmit(`[${urlDisplayText}](${urlText})`);
    else props.handleSubmit(urlDisplayText);
  };

  const documentOptions = Object.keys(props.graph)
    .sort()
    .map((docId) => ({
      title: props.graph[docId].title,
      kind: props.graph[docId].kind,
      docId,
    }));

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
          <Autocomplete<IDocumentOption>
            value={document}
            onChange={(evt, newValue) => setDocument(newValue)}
            options={documentOptions}
            getOptionLabel={(opt) => opt.title}
            renderOption={(opt) => (
              <span>
                {opt.title}
                &nbsp;
                <span className={classes.kind}>{opt.kind}</span>
              </span>
            )}
            renderInput={(params) => (
              <TextField
                {...params}
                className={classes.input}
                size="small"
                fullWidth={true}
                label="Document, e.g. 'Suzanne'"
                variant="outlined"
                disabled={!!urlText || !!urlDisplayText}
              />
            )}
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

const mapStateToProps = (state: IAppState, ownProps) => ({
  graph: state.docs.graph,
  isOpen: ownProps.isOpen,
  handleSubmit: ownProps.handleSubmit,
});

export default connect(mapStateToProps)(AddLinkDialog);
