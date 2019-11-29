import * as React from "react";
import { connect } from "react-redux";
import { IAppState } from "../../model";
import { Content } from "cohen-db/schema";
import CanonTextView from "./CanonTextView";
import ContentPartView from "./ContentPartView";

const css = require("./docviewer.css");

interface IProps {
  content: Content;
}

class ContentView extends React.Component<IProps> {
  public render() {

    if (Array.isArray(this.props.content.content))
      return this.props.content.content.map((part, i) => <ContentPartView section={i} key={i} part={part} />);
    else return <div className={css.card}>
      <CanonTextView prefix={''} text={this.props.content.content} />
    </div>;
  }
}

// currently not using redux connection
const mapStateToProps = (state: IAppState, ownProps: IProps) => ({
  content: ownProps.content
});

export default connect(mapStateToProps)(ContentView);
