import { Paper, Typography } from "@material-ui/core";
import * as React from "react";
import { connect } from "react-redux";

import { IDoc, IDocMeta } from "../../../shared/IApiTypes";
import { setScrolled } from "../../actions";
import { IAppState } from "../../model";
import AnnotationsView from "./AnnotationsView";
import ContentView from "./ContentView";
import DocReferencePreview from "./DocReferencePreview";
import MetadataView from "./MetadataView";

const css = require("./docviewer.css");

interface IProps {
  id: string;
  doc: IDoc;
  docMeta: IDocMeta;
  focusPart: string;
  setScrolled: typeof setScrolled;
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

  public componentDidMount() {
    /*
    if (this.props.doc && this.props.focus.waitingToScroll) {
      const elId = SerializeDocRef(this.props.focus.docRef).split("#")[1];
      document.getElementById(elId).scrollIntoView({ behavior: "smooth" });
      this.props.setScrolled();
    } */

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
              <ContentView
                docId={this.props.id}
                content={this.props.doc.file.content}
                annotations={this.props.doc.annotations}
                focusPart={this.props.focusPart}
              />
            )}
          </Paper>
          {this.state.hasContentDom && (
            <AnnotationsView annotations={this.props.doc.annotations} />
          )}
          {this.props.doc.children && (
            <div className={css.section}>
              <div className={css.sectiontitle}>Children</div>
              {this.props.doc.children.map((child, i) => (
                <DocReferencePreview preview={child} key={i} />
              ))}
            </div>
          )}
          {this.props.doc.referrers && (
            <div className={css.section}>
              <div className={css.sectiontitle}>References</div>
              {this.props.doc.referrers.map((referrer, i) => (
                <DocReferencePreview preview={referrer} key={i} />
              ))}
            </div>
          )}
        </div>
      );
  }
}

const mapStateToProps = (state: IAppState, ownProps) => ({
  id: ownProps.id,
  doc: ownProps.doc,
  docMeta: ownProps.docMeta,
  focusPart: ownProps.focusPart,
});

export default connect(mapStateToProps, { setScrolled })(DocViewer);
