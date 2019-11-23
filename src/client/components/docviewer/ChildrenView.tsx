import * as React from "react";
import { connect } from "react-redux";
import { IAppState } from "../../model";
import DocReference from "./DocReference";

const css = require("./docviewer.css");

interface IProps {
  childIds: string[]
}

class ChildrenView extends React.Component<IProps> {
  public render() {
    return <div>
      Children:
      {this.props.childIds.map((id, i) => <DocReference key={i} reference={{docId: id}} />)}
    </div>;
  }
}

// currently not using redux connection
const mapStateToProps = (state: IAppState, ownProps: IProps) => ({
    childIds: ownProps.childIds
});

export default connect(mapStateToProps)(ChildrenView);
