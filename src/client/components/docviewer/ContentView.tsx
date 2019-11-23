import * as React from "react";
import { connect } from "react-redux";
import { IAppState } from "../../model";
import { Content } from "cohen-db/schema";
import { isArray } from "util";
import CanonTextView from "./CanonTextView";
import ContentPartView from "./ContentPartView";

const css = require("./docviewer.css");

interface IProps {
  content: Content
}

class ContentView extends React.Component<IProps> {
  public render() {

    if (isArray(this.props.content.content))
        return this.props.content.content.map((part, i) => <ContentPartView key={i} part={part} />);
    else return <CanonTextView text={this.props.content.content} />

    return this.props.content;
  }
}

// currently not using redux connection
const mapStateToProps = (state: IAppState, ownProps: IProps) => ({
    content: ownProps.content
});

export default connect(mapStateToProps)(ContentView);
