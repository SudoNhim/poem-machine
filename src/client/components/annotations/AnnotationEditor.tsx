import {
  Button,
  Divider,
  IconButton,
  TextField,
  makeStyles,
} from "@material-ui/core";
import { Check, Clear } from "@material-ui/icons";
import * as React from "react";
import { connect } from "react-redux";

import { IAnnotation } from "../../../shared/ApiTypes";
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
  anchor: string;
  annotation?: IAnnotation;
  username: string;
  setDoc: typeof setDoc;
  onChange: (anno: IAnnotation) => void;
  onFinished: () => void;
}

const AnnotationEditor: React.FunctionComponent<IProps> = (props) => {
  const classes = useStyles();

  const [newAnnotationText, setNewAnnotationText] = React.useState("");
  const [addLinkDialogOpen, setAddLinkDialogOpen] = React.useState(false);

  React.useEffect(() => {
    if (props.annotation)
      setNewAnnotationText(tokensToText(props.annotation.content));
  }, [props.annotation]);

  const newAnnotation: IAnnotation = newAnnotationText
    ? props.annotation
      ? { ...props.annotation, content: textToTokens(newAnnotationText) }
      : {
          id: null, // will be filled in server side
          user: props.username,
          content: textToTokens(newAnnotationText),
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
        content: newAnnotation.content,
      });
    } else {
      await postUserAction({
        kind: "addAnnotation",
        documentId: props.docId,
        anchor: props.anchor,
        content: newAnnotation.content,
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
  anchor: state.focus.docPart,
  docId: state.focus.docId,
  username: state.user.username || "anonymous",
});

export default connect(mapStateToProps, { setDoc })(AnnotationEditor);
