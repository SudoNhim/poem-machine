import {
  Button,
  Divider,
  IconButton,
  TextField,
  makeStyles,
} from "@material-ui/core";
import { Check, Clear } from "@material-ui/icons";
import { Annotation, Reference } from "cohen-db/schema";
import * as React from "react";
import { connect } from "react-redux";

import { setDoc } from "../../actions";
import { getDoc, postUserAction } from "../../api";
import { IAppState } from "../../model";
import { textToTokens, tokensToText } from "../../util";
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
  buttonLeft: {
    marginRight: 10,
  },

  buttonRight: {
    marginRight: 10,
    float: "right",
  },
});

interface IProps {
  docId: string;
  anchor: Reference;
  annotation?: Annotation;
  username: string;
  setDoc: typeof setDoc;
  onChange: (anno: Annotation) => void;
  onFinished: () => void;
}

const AnnotationEditor: React.FunctionComponent<IProps> = (props) => {
  const classes = useStyles();

  const [newAnnotationText, setNewAnnotationText] = React.useState("");
  const [addLinkDialogOpen, setAddLinkDialogOpen] = React.useState(false);

  React.useEffect(() => {
    if (props.annotation)
      setNewAnnotationText(tokensToText(props.annotation.tokens));
  }, [props.annotation]);

  const newAnnotation: Annotation = newAnnotationText
    ? props.annotation
      ? { ...props.annotation, tokens: textToTokens(newAnnotationText) }
      : {
          id: null, // will be filled in server side
          user: props.username,
          tokens: textToTokens(newAnnotationText),
        }
    : null;

  React.useEffect(() => props.onChange(newAnnotation), [newAnnotationText]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (props.annotation && props.annotation.id) {
      await postUserAction({
        kind: "editAnnotation",
        documentId: props.docId,
        anchor: props.anchor,
        annotationId: newAnnotation.id,
        tokens: newAnnotation.tokens,
      });
    } else {
      await postUserAction({
        kind: "addAnnotation",
        documentId: props.docId,
        anchor: props.anchor,
        tokens: newAnnotation.tokens,
      });
    }

    const loaded = await getDoc(props.docId);
    props.setDoc(props.docId, loaded);
    setNewAnnotationText("");
    props.onFinished();
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
            className={classes.buttonLeft}
            size="small"
            variant="contained"
            onClick={() => setAddLinkDialogOpen(true)}
          >
            add link
          </Button>
          <IconButton
            className={classes.buttonRight}
            size="small"
            color="primary"
            type="submit"
            disabled={!newAnnotationText}
          >
            <Check />
          </IconButton>
          <IconButton
            className={classes.buttonRight}
            size="small"
            onClick={() => {
              setNewAnnotationText("");
              props.onFinished();
            }}
            disabled={!newAnnotationText}
          >
            <Clear />
          </IconButton>
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
  onFinished: ownProps.onFinished,
  anchor: state.focus.reference,
  docId: state.focus.reference.documentId,
  username: state.user.username || "anonymous",
});

export default connect(mapStateToProps, { setDoc })(AnnotationEditor);
