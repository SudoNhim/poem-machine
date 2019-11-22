import * as React from "react";
import { connect } from "react-redux";
import { getDoc } from "../api";
import { setDoc } from "../actions";
import { IDoc, IDocMeta, IDocReference } from "../../shared/IApiTypes";
import { IAppState } from "../model";
import { Link } from 'react-router-dom';
import Referrer from "./Referrer";
import MDReactComponent from "markdown-react-js";

const css = require("./all.css");

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
    if (!this.props.docMeta)
      return <div className={css.viewsection}>Document does not exist.</div>;
    else if (!this.props.doc)
      return <div className={css.viewsection}>Loading...</div>;
    else {
      const title = <div className={css.viewsection}>
        <p className={css.docviewer_title}>{this.props.docMeta.title}</p></div>;

      var desc = null, text = null;
      if (this.props.doc.file.content) {
        const content = this.props.doc.file.content;

        if (content.preamble) desc = (
          <div className={css.viewsection + ' ' + css.docviewer_description}>
            <MDReactComponent
              text={this.props.doc.file.content.preamble} />
          </div>);

        if (Array.isArray(content.content)) {
          text = content.content.map((part, i) => (
            <div className={css.viewsection + ' ' + css.docviewer_text} key={i}>
              {part.content.text.map((p, i2) => (
                <p key={i2}>{
                  Array.isArray(p)
                    ? p.map((l, i3) => <span key={i3}>{l}<br /></span>)
                    : <span>{p}<br /></span>
                }</p>))}</div>
          ));
        } else
          text = <div className={css.viewsection + ' ' + css.docviewer_text}>
            {content.content.text.map((p, i2) => (
              <p key={i2}>{
                Array.isArray(p)
                  ? p.map((l, i3) => <span key={i3}>{l}<br /></span>)
                  : <span>{p}<br /></span>
              }</p>))}</div>
      }

      const refs = this.props.doc.referrers && this.props.doc.referrers.length > 0 ?
        <div className={css.viewsection}>
          <p className={css.docviewer_title}>Referenced by:</p>
          {(this.props.doc.referrers || []).map(ref => <Referrer id={ref.docId} key={ref.docId} />)}
        </div>
        : null;

      return (
        <div>
          {title}
          {desc}
          {text}
          {refs}
        </div>
      );
    }
  }
}

const mapStateToProps = (state: IAppState, ownProps) => ({
  id: ownProps.id,
  doc: state.docs.cache[ownProps.id],
  docMeta: state.docs.graph[ownProps.id]
});

export default connect(
  mapStateToProps,
  { setDoc }
)(DocViewer);
