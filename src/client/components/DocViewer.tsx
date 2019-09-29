import * as React from "react";
import { connect } from "react-redux";
import { getDoc } from "../api";
import { setDoc } from "../actions";
import { IDoc, IDocMeta } from "../../shared/IApiTypes";
import { IAppState } from "../model";
import Referrer from "./Referrer";
import * as Marked from "marked";
import * as DomPurify from "dompurify";
import { number } from "prop-types";

const css = require("./all.css");

const renderer = new Marked.Renderer();
const defaultRenderer = new Marked.Renderer();

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

    // Special handling for links to other documents
    const docLinks: string[] = (this.props.doc && this.props.doc.links) || [];
    renderer.link = (href, title, text) => {
      if (href.startsWith("#")) {
        try {
          const index = parseInt(href.substr(1));
          href = `/doc/${docLinks[index]}`;
        }
        finally {}
      }

      return defaultRenderer.link(href, title, text);
    }

    if (!this.props.docMeta)
      return <div className={css.viewsection}>Document does not exist.</div>;
    else if (!this.props.doc)
      return <div className={css.viewsection}>Loading...</div>;
    else {
      const title = <div className={css.viewsection}>
        <p className={css.docviewer_title}>{this.props.docMeta.title}</p></div>

      const desc = this.props.doc.description ?
        <div
          className={css.viewsection + ' ' + css.docviewer_description}
          dangerouslySetInnerHTML={{__html: DomPurify.sanitize(Marked(this.props.doc.description, { renderer }))}} />
        : null;

      const text = this.props.doc.text ?
        <div className={css.viewsection + ' ' + css.docviewer_text}>
          {this.props.doc.text.split("\n\n").map((p, i) => (
            <p key={i}>{p.split("\n").map((l, i2) => <span key={i2}>{l}<br /></span>)}</p>))}</div>
        : null;

      const refs = this.props.doc.referrers && this.props.doc.referrers.length > 0 ?
          <div className={css.viewsection}>
            <p className={css.docviewer_title}>Referenced by:</p>
            {(this.props.doc.referrers || []).map(id => <Referrer id={id} key={id} />)}
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
