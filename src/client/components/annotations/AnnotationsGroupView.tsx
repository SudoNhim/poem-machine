import { Card, CardContent, Typography, makeStyles } from "@material-ui/core";
import { Annotation, AnnotationsGroup } from "cohen-db/schema";
import * as React from "react";
import { connect } from "react-redux";

import { IDoc } from "../../../shared/ApiTypes";
import { setDoc } from "../../actions";
import { IAppState, IHoverState } from "../../model";
import { snippetFromDoc } from "../../util";
import AnnotationEditor from "./AnnotationEditor";
import AnnotationView from "./AnnotationView";
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
  annotationsGroup: AnnotationsGroup;
  hover: IHoverState;
  allowEdit: boolean;
  setDoc: typeof setDoc;
}

const AnnotationsGroupView: React.FunctionComponent<IProps> = (props) => {
  const classes = useStyles();
  const [editIndex, setEditIndex] = React.useState(-1);
  const [editingAnnotation, setEditingAnnotation] = React.useState<Annotation>(
    null
  );
  const [deleteAnnotation, setDeleteAnnotation] = React.useState<Annotation>(
    null
  );

  return (
    <Card className={classes.root}>
      <CardContent>
        <Typography className={classes.title} color="textSecondary">
          {snippetFromDoc(props.doc, props.annotationsGroup.anchor)}
        </Typography>
        {props.annotationsGroup.annotations.map((anno, i) => (
          <AnnotationView
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
          <AnnotationView annotation={editingAnnotation} isPreview={true} />
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
  doc: state.docs.cache[state.focus.reference.documentId],
  docId: state.focus.reference.documentId,
  hover: state.hover,
  allowEdit: ownProps.allowEdit,
});

export default connect(mapStateToProps, { setDoc })(AnnotationsGroupView);
