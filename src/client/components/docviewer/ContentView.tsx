import { Divider } from "@material-ui/core";
import { Content } from "cohen-db/schema";
import * as React from "react";
import { connect } from "react-redux";

import { IAppState } from "../../model";
import CanonTextView from "./CanonTextView";
import ContentPartView from "./ContentPartView";

const css = require("./docviewer.css");

interface IProps {
  content: Content;
}

class ContentView extends React.Component<IProps> {
  public componentDidMount() {}

  public render() {
    if (Array.isArray(this.props.content.content)) {
      const parts = this.props.content.content.map((part, i) => (
        <ContentPartView section={i + 1} key={i} part={part} />
      ));
      let withDividers: JSX.Element[] = [];
      parts.forEach((part, i) => {
        withDividers.push(part);
        if (i < parts.length - 1)
          withDividers.push(<Divider key={i + parts.length} />);
      });
      return withDividers;
    } else
      return <CanonTextView prefix={""} text={this.props.content.content} />;
  }
}

// currently not using redux connection
const mapStateToProps = (state: IAppState, ownProps: IProps) => ({
  content: ownProps.content,
});

export default connect(mapStateToProps)(ContentView);
