import * as React from "react";
import { connect } from "react-redux";

import { IAnnotationsGroup } from "../../../shared/IApiTypes";
import { setDoc } from "../../actions";
import { IAppState, IFocusState } from "../../model";
import AnnotationsGroup from "./AnnotationsGroup";

interface IProps {
  focus: IFocusState;
  annotations: IAnnotationsGroup[];
  hasDoc: boolean;
}

const AnnotationsView: React.FunctionComponent<IProps> = (props) => {
  if (!props.hasDoc) {
    return null;
  }

  let annotations: IAnnotationsGroup[] = props.annotations;
  if (!!props.focus.docPart) {
    annotations = annotations.filter(
      (grp) => grp.anchor === props.focus.docPart
    );
    if (annotations.length > 1)
      throw new Error("Expected only one annotation group per docpart");
    if (annotations.length === 0)
      annotations.push({
        anchor: props.focus.docPart,
        annotations: [],
      });
  }

  return (
    <React.Fragment>
      {annotations.map((grp, i) => (
        <AnnotationsGroup
          annotationsGroup={grp}
          allowEdit={!!props.focus.docPart}
          key={i}
        />
      ))}
    </React.Fragment>
  );
};

const mapStateToProps = (state: IAppState) => ({
  annotations: state.docs.cache[state.focus.docId]?.annotations || [],
  focus: state.focus,
  hasDoc: !!state.docs.cache[state.focus.docId],
});

export default connect(mapStateToProps, { setDoc })(AnnotationsView);
