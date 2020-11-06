import { Button, Divider, TextField, makeStyles } from "@material-ui/core";
import * as React from "react";
import { connect } from "react-redux";

import { IAnnotation, IContentToken } from "../../../shared/IApiTypes";
import { setDoc } from "../../actions";
import { addAnnotation, getDoc } from "../../api";
import { IAppState } from "../../model";
import { textToTokens } from "../../util";
import AddLinkDialog from "./AddLinkDialog";

const useStyles = makeStyles({
  contentContainer: {
    paddingTop: 10,
    paddingBottom: 10,
  },
  editorInput: {
    marginTop: 10,
    marginBottom: 10,
  },
  button: {
    marginRight: 10,
  },
});

interface IProps {
  docId: string;
  anchor: string;
  annotation?: IAnnotation;
  username: string;
  setDoc: typeof setDoc;
  onChange: (anno: IAnnotation) => void;
}

const AnnotationEditor: React.FunctionComponent<IProps> = (props) => {
  const classes = useStyles();

  const [newAnnotationText, setNewAnnotationText] = React.useState("");
  const [addLinkDialogOpen, setAddLinkDialogOpen] = React.useState(false);

  const newAnnotation = newAnnotationText
    ? {
        ...props.annotation,
        user: props.username,
        content: textToTokens(newAnnotationText),
      }
    : null;

  React.useEffect(() => props.onChange(newAnnotation), [newAnnotationText]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await addAnnotation(props.docId, props.anchor, newAnnotation);
    const loaded = await getDoc(props.docId);
    props.setDoc(props.docId, loaded);
    setNewAnnotationText("");
  };

  const handleAddLink = (text: string) => {
    const sep = newAnnotationText.endsWith(" ") ? "" : " ";
    setNewAnnotationText(newAnnotationText + sep + text);
    setAddLinkDialogOpen(false);
  };

  return (
    <React.Fragment>
      <Divider />
      <div className={classes.contentContainer}>
        <form onSubmit={handleSubmit}>
          <TextField
            className={classes.editorInput}
            size="small"
            fullWidth={true}
            label="New annotation"
            variant="outlined"
            multiline={true}
            value={newAnnotationText}
            onChange={(e) => setNewAnnotationText(e.target.value)}
          />
          <Button
            className={classes.button}
            variant="contained"
            onClick={() => setAddLinkDialogOpen(true)}
          >
            add link
          </Button>
          <Button
            className={classes.button}
            variant="contained"
            color="primary"
            type="submit"
            disabled={!newAnnotationText}
          >
            submit
          </Button>
        </form>
        <AddLinkDialog
          isOpen={addLinkDialogOpen}
          handleSubmit={handleAddLink}
        />
      </div>
    </React.Fragment>
  );
};

const mapStateToProps = (state: IAppState, ownProps) => ({
  annotation: ownProps.annotation,
  onChange: ownProps.onChange,
  anchor: state.focus.docPart,
  docId: state.focus.docId,
  username: state.user.username,
});

export default connect(mapStateToProps, { setDoc })(AnnotationEditor);
