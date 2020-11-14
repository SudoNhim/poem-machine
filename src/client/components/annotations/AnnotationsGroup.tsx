import { Card, CardContent, Typography, makeStyles } from "@material-ui/core";
import * as React from "react";
import { connect } from "react-redux";

import {
  IAnnotation,
  IAnnotationsGroup,
  IDoc,
} from "../../../shared/IApiTypes";
import { setDoc } from "../../actions";
import { IAppState, IHoverState } from "../../model";
import { snippetFromDoc } from "../../util";
import Annotation from "./Annotation";
import AnnotationEditor from "./AnnotationEditor";
import DeleteDialog from "./DeleteDialog";

const useStyles = makeStyles({
  root: {
    marginTop: 20,
    marginRight: 16,
    marginBottom: 16,
  },
  title: {
    fontSize: 16,
  },
});

interface IProps {
  docId: string;
  doc: IDoc;
  annotationsGroup: IAnnotationsGroup;
  hover: IHoverState;
  allowEdit: boolean;
  setDoc: typeof setDoc;
}

const AnnotationsGroup: React.FunctionComponent<IProps> = (props) => {
  const classes = useStyles();
  const [editIndex, setEditIndex] = React.useState(-1);
  const [editingAnnotation, setEditingAnnotation] = React.useState<IAnnotation>(
    null
  );
  const [deleteAnnotation, setDeleteAnnotation] = React.useState<IAnnotation>(
    null
  );

  return (
    <Card className={classes.root}>
      <CardContent>
        <Typography className={classes.title} color="textSecondary">
          {snippetFromDoc(props.doc, props.annotationsGroup.anchor)}
        </Typography>
        {props.annotationsGroup.annotations.map((anno, i) => (
          <Annotation
            annotation={(i === editIndex ? editingAnnotation : anno) || anno}
            key={i}
            isPreview={i === editIndex}
            allowEdit={props.allowEdit && i !== editIndex}
            onEdit={() => {
              setEditingAnnotation(anno);
              setEditIndex(i);
            }}
            onDelete={() => setDeleteAnnotation(anno)}
          />
        ))}
        {editingAnnotation && editIndex === -1 && (
          <Annotation annotation={editingAnnotation} isPreview={true} />
        )}
        {props.allowEdit && (
          <AnnotationEditor
            annotation={editingAnnotation}
            onChange={setEditingAnnotation}
            onFinished={() => {
              setEditIndex(-1);
            }}
          />
        )}
        {deleteAnnotation && (
          <DeleteDialog
            annotation={deleteAnnotation}
            onFinished={() => setDeleteAnnotation(null)}
          />
        )}
      </CardContent>
    </Card>
  );
};

const mapStateToProps = (state: IAppState, ownProps) => ({
  annotationsGroup: ownProps.annotationsGroup,
  doc: state.docs.cache[state.focus.docId],
  docId: state.focus.docId,
  hover: state.hover,
  allowEdit: ownProps.allowEdit,
});

export default connect(mapStateToProps, { setDoc })(AnnotationsGroup);