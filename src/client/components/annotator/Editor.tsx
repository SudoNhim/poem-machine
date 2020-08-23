import * as React from "react";
import { connect } from "react-redux";
import { IAppState } from "../../model";
import { IAnnotation } from "../../../shared/IApiTypes";

const css = require("./annotator.css");

interface IProps {
  source?: IAnnotation
}

interface IState {
}

class Editor extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
  }

  public render() {
    return <div>EDITOR</div>
  }
}

const mapStateToProps = (state: IAppState, ownProps) => ({
  focus: state.focus,
  docs: state.docs
});

export default connect(mapStateToProps, { })(Editor);
