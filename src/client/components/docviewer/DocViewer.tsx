import * as React from "react";
import { connect } from "react-redux";
import { getDoc } from "../../api";
import { setDoc } from "../../actions";
import { IDoc, IDocMeta } from "../../../shared/IApiTypes";
import { IAppState } from "../../model";
import ContentView from "./ContentView";
import MetadataView from "./MetadataView";
import DocReferencePreviewList from "./DocReferencePreviewList";

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
    else if (!this.props.doc)
      return <div>
        <div className={css.section + ' ' + css.heading}>{this.props.docMeta.title}</div>
        Loading...
      </div>;
      else
        return (
        <div>
          <div className={css.section + ' ' + css.heading}>{this.props.docMeta.title}</div>
          {this.props.doc.file.metadata &&
            <div className={css.section}>
              <div className={css.sectiontitle}>Metadata</div>
              <MetadataView metadata={this.props.doc.file.metadata} />
            </div>}
          {this.props.doc.file.content &&
            <div className={css.section}>
              <div className={css.sectiontitle}>Content</div>
              <ContentView content={this.props.doc.file.content} />
              </div>}
          {this.props.doc.children &&
            <div className={css.section}>
              <div className={css.sectiontitle}>Children</div>
              <DocReferencePreviewList previews={this.props.doc.children} />
            </div>}
          {this.props.doc.referrers && 
            <div className={css.section}>
              <div className={css.sectiontitle}>Referred to by</div>
              <DocReferencePreviewList previews={this.props.doc.referrers} />
            </div>}
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
