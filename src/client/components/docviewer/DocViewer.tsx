import * as React from "react";
import { connect } from "react-redux";
import { getDoc } from "../../api";
import { setDoc, setScrolled } from "../../actions";
import { IDoc, IDocMeta } from "../../../shared/IApiTypes";
import { IAppState, IFocusState } from "../../model";
import AnnotationsView from './AnnotationsView';
import ContentView from "./ContentView";
import MetadataView from "./MetadataView";
import DocReferencePreviewList from "./DocReferencePreviewList";
import { SerializeDocRef } from "../../../shared/util";

const css = require("./docviewer.css");

interface IProps {
  id: string;
  doc: IDoc;
  docMeta: IDocMeta;
  focus: IFocusState;
  setScrolled: typeof setScrolled;
  setDoc: typeof setDoc;
}

interface IState {
  hasContentDom: boolean;
}

class DocViewer extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.state = {
      hasContentDom: false
    };
  }

  public async componentDidMount() {
    const doc = await getDoc(this.props.id);
    this.props.setDoc(this.props.id, doc);
  }

  public componentDidUpdate() {
    if (this.props.doc && this.props.focus.waitingToScroll) {
      const elId = SerializeDocRef(this.props.focus.docRef).split('#')[1];
      document.getElementById(elId).scrollIntoView({ behavior: 'smooth' });
      this.props.setScrolled();
    }

    if (!this.state.hasContentDom)
      this.setState({ hasContentDom: true });
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
              <MetadataView metadata={this.props.doc.file.metadata} />
            </div>}
          {this.props.doc.file.content &&
            <div className={css.section}>
              <ContentView content={this.props.doc.file.content} />
              {this.state.hasContentDom && <AnnotationsView annotations={this.props.doc.annotations} />}
              </div>}
          {this.props.doc.children &&
            <div className={css.section}>
              <div className={css.sectiontitle}>Children</div>
              <DocReferencePreviewList previews={this.props.doc.children} />
            </div>}
          {this.props.doc.referrers && 
            <div className={css.section}>
              <div className={css.sectiontitle}>References</div>
              <DocReferencePreviewList previews={this.props.doc.referrers} />
            </div>}
        </div>
      );
  }
}

const mapStateToProps = (state: IAppState, ownProps) => ({
  id: ownProps.id,
  doc: state.docs.cache[ownProps.id],
  docMeta: state.docs.graph[ownProps.id],
  focus: state.focus
});

export default connect(mapStateToProps, { setDoc, setScrolled })(DocViewer);
