import { Divider } from "@material-ui/core";
import { Content } from "cohen-db/schema";
import * as React from "react";
import { connect } from "react-redux";

import { IAnnotation } from "../../../shared/IApiTypes";
import { IAppState } from "../../model";
import CanonTextView from "./CanonTextView";
import ContentPartView from "./ContentPartView";

interface IProps {
  docId: string;
  content: Content;
  annotations: IAnnotation[];
  focusPart: string;
}

class ContentView extends React.Component<IProps> {
  public componentDidMount() {}

  public render() {
    if (Array.isArray(this.props.content.content)) {
      const parts = this.props.content.content.map((part, i) => (
        <ContentPartView
          section={i + 1}
          key={i}
          part={part}
          focusPart={this.props.focusPart}
          docId={this.props.docId}
          annotations={this.props.annotations}
        />
      ));
      let withDividers: JSX.Element[] = [];
      parts.forEach((part, i) => {
        withDividers.push(part);
        if (i < parts.length - 1)
          withDividers.push(<Divider key={i + parts.length} />);
      });
      return withDividers;
    } else
      return (
        <CanonTextView
          prefix={""}
          docId={this.props.docId}
          text={this.props.content.content}
          focusPart={this.props.focusPart}
          annotations={this.props.annotations}
        />
      );
  }
}

// currently not using redux connection
const mapStateToProps = (state: IAppState, ownProps: IProps) => ({
  docId: ownProps.docId,
  content: ownProps.content,
  annotations: ownProps.annotations,
  focusPart: ownProps.focusPart,
});

export default connect(mapStateToProps)(ContentView);
