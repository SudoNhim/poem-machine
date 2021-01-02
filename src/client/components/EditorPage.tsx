import {
  FormControlLabel,
  Paper,
  Switch,
  TextField,
  Theme,
  Typography,
  makeStyles,
} from "@material-ui/core";
import { CanonFile } from "cohen-db/schema";
import * as React from "react";
import { connect } from "react-redux";
import { RouteComponentProps } from "react-router";

import { IDoc, IDocGraph } from "../../shared/ApiTypes";
import { GenerateIdFromDoc } from "../../shared/util";
import { setDoc } from "../actions";
import { getDoc } from "../api";
import { IAppState } from "../model";
import { findParentId } from "../util";
import ContentEditor from "./editor/ContentEditor";
import DocumentChoiceInput from "./shared/DocumentChoiceInput";
import DocumentKindSelect from "./shared/DocumentKindSelect";

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    padding: theme.spacing(2),
    minWidth: "70vw",
  },
  inputPart: {
    marginBottom: 10,
    marginTop: 10,
  },
  secondary: {
    color: theme.palette.text.secondary,
  },
}));

/*
  Child of: [            ]
  Title: [               ]
  Metadata:
     [   ]: [            ]
     [   ]: [            ]
     [   ]: [            ]
     (+)
  Type: [simple|multipart]
  ?SectionTitle: [       ]
  Content:
     [[    ] [         ]
      [   ][]
      [         ]      ]
  Hint: 'Enter' to end fragment
    and again to create newline
*/

interface IMatchParams {
  docId?: string;
}

interface IProps extends RouteComponentProps<IMatchParams> {
  user: string;
  graph: IDocGraph;
  setDoc: typeof setDoc;
}

const EditorPage: React.FunctionComponent<IProps> = (props: IProps) => {
  const classes = useStyles();

  const [activeDocument, setActiveDocument] = React.useState<IDoc>(null);
  const [activeDocumentId, setActiveDocumentId] = React.useState<string | null>(
    null
  );
  const [parentDocumentId, setParentDocumentId] = React.useState<string | null>(
    null
  );

  // Can only be changed when there is no content
  const [isMultipart, setIsMultipart] = React.useState(false);

  React.useEffect(() => {
    const documentId = props.match.params.docId;
    if (documentId === "new") {
      const newFile: CanonFile = {
        title: null,
        kind: null,
        user: props.user,
        version: 0,
        annotations: [],
      };
      setActiveDocument({ file: newFile });
    } else {
      if (props.graph[documentId]) {
        setActiveDocumentId(documentId);
        setParentDocumentId(findParentId(documentId, props.graph));
        getDoc(documentId).then((doc) => {
          setActiveDocument(doc);
          setIsMultipart(!!(doc.file.content?.kind === "multipart"));
        });
      } else {
        throw new Error(`Document ${documentId} not found`);
      }
    }
  }, [props.match.params.docId]);

  const isNewDocument = props.match.params.docId === "new";
  const id = activeDocument && GenerateIdFromDoc(activeDocument?.file);

  return (
    activeDocument && (
      <Paper className={classes.root}>
        <Typography variant="h5" gutterBottom>
          {isNewDocument ? "Create Document" : "Edit Document"}
        </Typography>
        <div className={classes.inputPart}>
          <DocumentChoiceInput
            required={true}
            label={"Parent"}
            value={parentDocumentId}
            onChange={setParentDocumentId}
          />
        </div>
        <div className={classes.inputPart}>
          <DocumentKindSelect
            required={true}
            disabled={!isNewDocument}
            value={activeDocument.file.kind}
            onChange={(value) =>
              setActiveDocument({
                ...activeDocument,
                file: {
                  ...activeDocument.file,
                  kind: value,
                },
              })
            }
          />
        </div>
        <div className={classes.inputPart}>
          <TextField
            size="small"
            fullWidth={true}
            label="Title"
            variant="outlined"
            type="url"
            disabled={!isNewDocument}
            required={true}
            value={activeDocument.file.title}
            onChange={(evt) =>
              setActiveDocument({
                ...activeDocument,
                file: {
                  ...activeDocument.file,
                  title: evt.target.value,
                },
              })
            }
          />
        </div>
        <Typography className={classes.secondary}>
          Generated ID: {id}
        </Typography>
        <div className={classes.inputPart}>
          <TextField
            size="small"
            fullWidth={true}
            label="Date"
            variant="outlined"
            type="date"
            InputLabelProps={{ shrink: true }}
            value={activeDocument.file.metadata?.date}
            onChange={(evt) =>
              setActiveDocument({
                ...activeDocument,
                file: {
                  ...activeDocument.file,
                  metadata: {
                    ...activeDocument.file.metadata,
                    date: evt.target.value,
                  },
                },
              })
            }
          />
        </div>
        <div className={classes.inputPart}>
          <FormControlLabel
            control={
              <Switch
                color="primary"
                checked={isMultipart}
                onChange={() => setIsMultipart(!isMultipart)}
                disabled={!!activeDocument.file.content}
              />
            }
            label="Multipart"
          />
        </div>
        <div className={classes.inputPart}>
          <ContentEditor
            content={activeDocument.file.content}
            useMultipart={isMultipart}
            onChange={(content) =>
              setActiveDocument({
                ...activeDocument,
                file: {
                  ...activeDocument.file,
                  content,
                },
              })
            }
          />
        </div>
      </Paper>
    )
  );
};

const mapStateToProps = (state: IAppState, ownProps) => ({
  user: state.user.username,
  graph: state.docs.graph,
});

export default connect(mapStateToProps, { setDoc })(EditorPage);
