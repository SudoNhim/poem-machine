import * as React from "react";
import { connect } from "react-redux";
import { IAppState } from "../../model";
import { Content } from "cohen-db/schema";

const css = require("./docviewer.css");

interface IProps {
  content: Content
}

class ContentView extends React.Component<IProps> {
  public render() {
    return this.props.content;
  }
}

// currently not using redux connection
const mapStateToProps = (state: IAppState, ownProps: IProps) => ({
    content: ownProps.content
});

export default connect(mapStateToProps)(ContentView);
