import * as React from "react";
import { connect } from "react-redux";

import { IAnnotationsGroup } from "../../../shared/IApiTypes";
import { setDoc } from "../../actions";
import { IAppState, IFocusState } from "../../model";
import AnnotationsGroup from "./AnnotationsGroup";

interface IProps {
  focus: IFocusState;
  annotations: IAnnotationsGroup[];
}

const AnnotationsView: React.FunctionComponent<IProps> = (props) => (
  <React.Fragment>
    {props.annotations
      .filter((grp) =>
        props.focus.docPart ? grp.anchor === props.focus.docPart : true
      )
      .map((grp, i) => (
        <AnnotationsGroup
          annotationsGroup={grp}
          allowEdit={!!props.focus.docPart}
          key={i}
        />
      ))}
  </React.Fragment>
);

const mapStateToProps = (state: IAppState) => ({
  annotations: state.docs.cache[state.focus.docId]?.annotations || [],
  focus: state.focus,
});

export default connect(mapStateToProps, { setDoc })(AnnotationsView);
