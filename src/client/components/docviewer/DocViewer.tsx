import * as React from "react";
import { connect } from "react-redux";
import { getDoc } from "../../api";
import { setDoc } from "../../actions";
import { IDoc, IDocMeta } from "../../../shared/IApiTypes";
import { IAppState } from "../../model";
import ReferrersView from "./ReferrersView";
import ChildrenView from "./ChildrenView";
import ContentView from "./ContentView";
import MetadataView from "./MetadataView";

const css = require("./docviewer.css");

interface IProps {
  id: string;
  doc: IDoc;
  docMeta: IDocMeta;
  setDoc: typeof setDoc;
}

class DocViewer extends React.Component<IProps> {
  public async componentDidMount() {
    const doc = await getDoc(this.props.id);
    this.props.setDoc(this.props.id, doc);
  }

  public render() {
    if (!this.props.docMeta) return <div>Document does not exist.</div>;
    else
      return (
        <div>
          <div>{this.props.docMeta.title}</div>
          {this.props.doc
            ? this.props.doc.file.metadata && (
                <MetadataView metadata={this.props.doc.file.metadata} />
            )
            : "Loading..."}
          {this.props.doc
            ? this.props.doc.file.content && (
                <ContentView content={this.props.doc.file.content} />
              )
            : "Loading..."}
          <ChildrenView childIds={this.props.docMeta.children} />
          {this.props.doc
            ? this.props.doc.referrers && (
                <ReferrersView referrers={this.props.doc.referrers} />
              )
            : "Loading..."}
        </div>
      );
  }
}

const mapStateToProps = (state: IAppState, ownProps) => ({
  id: ownProps.id,
  doc: state.docs.cache[ownProps.id],
  docMeta: state.docs.graph[ownProps.id]
});

export default connect(mapStateToProps, { setDoc })(DocViewer);
