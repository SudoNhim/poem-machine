import { Button, Divider, TextField, makeStyles } from "@material-ui/core";
import * as React from "react";
import { connect } from "react-redux";

import { IAnnotation, IAnnotationToken } from "../../../shared/IApiTypes";
import { setDoc } from "../../actions";
import { addAnnotation, getDoc } from "../../api";
import { IAppState } from "../../model";
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

const textToTokens = (text: string): IAnnotationToken[] => {
  const extLinksRegex = /\[([^\[]+)\]\((.*)\)/;
  const docRefsRegex = /(?<=[\s>]|^)#(\w*[A-Za-z_]\.[A-Za-z_0-9]*)/;
  const tokens: IAnnotationToken[] = [];
  while (text) {
    const extLinkMatch = text.match(extLinksRegex);
    const docRefMatch = text.match(docRefsRegex);
    const textMatchIndex = Math.min(
      text.length,
      extLinkMatch?.index || 9999,
      docRefMatch?.index || 9999
    );
    if (extLinkMatch && extLinkMatch.index === 0) {
      tokens.push({
        kind: "link",
        text: extLinkMatch[1],
        link: extLinkMatch[2],
      });
      text = text.substr(extLinkMatch[0].length);
    } else if (docRefMatch && docRefMatch.index === 0) {
      tokens.push({
        kind: "docref",
        docRef: docRefMatch[1],
      });
      text = text.substr(docRefMatch[0].length);
    } else {
      tokens.push({ kind: "text", text: text.substr(0, textMatchIndex) });
      text = text.substr(textMatchIndex);
    }
  }

  return tokens;
};

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
