import * as React from "react";
import { connect } from "react-redux";
import { IAppState } from "../../model";
import { Metadata, Text, Prologue, Variation, Note } from "cohen-db/schema";
import CanonTextView from "./CanonTextView";

const css = require("./docviewer.css");

interface IProps {
  part: (Prologue | Variation | Note)
}

class ContentPartView extends React.Component<IProps> {
  public render() {
    return <CanonTextView text={this.props.part.content} />;
  }
}

// currently not using redux connection
const mapStateToProps = (state: IAppState, ownProps: IProps) => ({
    part: ownProps.part
});

export default connect(mapStateToProps)(ContentPartView);
