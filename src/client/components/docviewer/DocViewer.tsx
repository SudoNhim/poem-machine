import { Paper, Typography } from "@material-ui/core";
import * as React from "react";
import { connect } from "react-redux";

import { IDoc, IDocMeta } from "../../../shared/IApiTypes";
import { SerializeDocRef } from "../../../shared/util";
import { setDoc, setScrolled } from "../../actions";
import { getDoc } from "../../api";
import { IAppState, IFocusState } from "../../model";
import AnnotationsView from "./AnnotationsView";
import ContentView from "./ContentView";
import DocReferencePreview from "./DocReferencePreview";
import MetadataView from "./MetadataView";

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
      hasContentDom: false,
    };
  }

  public async componentDidMount() {
    const doc = await getDoc(this.props.id);
    this.props.setDoc(this.props.id, doc);
  }

  public componentDidUpdate() {
    if (this.props.doc && this.props.focus.waitingToScroll) {
      const elId = SerializeDocRef(this.props.focus.docRef).split("#")[1];
      document.getElementById(elId).scrollIntoView({ behavior: "smooth" });
      this.props.setScrolled();
    }

    if (!this.state.hasContentDom) this.setState({ hasContentDom: true });
  }

  public render() {
    if (!this.props.docMeta) return <div>Document does not exist.</div>;
    else if (!this.props.doc)
      return (
        <div>
          <div className={css.section + " " + css.heading}>
            {this.props.docMeta.title}
          </div>
          Loading...
        </div>
      );
    else
      return (
        <div>
          <Paper className={css.section}>
            <Typography variant="h6" component="h2">
              {this.props.docMeta.title}
            </Typography>
            {this.props.doc.file.metadata && (
              <MetadataView metadata={this.props.doc.file.metadata} />
            )}
            {this.props.doc.file.content && (
              <ContentView content={this.props.doc.file.content} />
            )}
          </Paper>
          {this.state.hasContentDom && (
            <AnnotationsView annotations={this.props.doc.annotations} />
          )}
          {this.props.doc.children && (
            <div className={css.section}>
              <div className={css.sectiontitle}>Children</div>
              {this.props.doc.children.map((child) => (
                <DocReferencePreview preview={child} />
              ))}
            </div>
          )}
          {this.props.doc.referrers && (
            <div className={css.section}>
              <div className={css.sectiontitle}>References</div>
              {this.props.doc.referrers.map((referrer) => (
                <DocReferencePreview preview={referrer} />
              ))}
            </div>
          )}
        </div>
      );
  }
}

const mapStateToProps = (state: IAppState, ownProps) => ({
  id: ownProps.id,
  doc: state.docs.cache[ownProps.id],
  docMeta: state.docs.graph[ownProps.id],
  focus: state.focus,
});

export default connect(mapStateToProps, { setDoc, setScrolled })(DocViewer);
