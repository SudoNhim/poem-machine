import * as React from "react";
import { connect } from "react-redux";
import { IAppState } from "../../model";

const css = require("./docviewer.css");

interface IProps {
  childIds: string[]
}

class ChildrenView extends React.Component<IProps> {
  public render() {
    return this.props.childIds.length;
  }
}

// currently not using redux connection
const mapStateToProps = (state: IAppState, ownProps: IProps) => ({
    childIds: ownProps.childIds
});

export default connect(mapStateToProps)(ChildrenView);
