import * as React from "react";
import { connect } from "react-redux";
import { RouteComponentProps } from "react-router";
import { withRouter } from "react-router-dom";
import { Link } from "react-router-dom";

import {
  IAnnotation,
  IAnnotationTokenDocRef,
  IAnnotationTokenLink,
  IAnnotationTokenText,
  IDocGraph,
} from "../../../shared/IApiTypes";
import { SerializeDocRef } from "../../../shared/util";
import { IAppState, IDocState, IFocusState } from "../../model";
import Editor from "./Editor";

const css = require("./annotator.css");

interface IProps extends RouteComponentProps {
  focus: IFocusState;
  docs: IDocState;
}

interface IState {
  editing: boolean;
}

class Annotator extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.state = {
      editing: false,
    };
  }

  public componentDidMount() {
    this.setState({
      editing: false,
    });
  }

  public render() {
    const docRef = this.props.focus.docRef;
    if (!docRef || (!docRef.line && !docRef.paragraph)) return null;

    const doc = this.props.docs.cache[docRef.docId];
    if (!doc) return null;

    const refPart = SerializeDocRef(docRef).split("#")[1];
    const annotations = (doc.annotations || []).filter(
      (annotation) => !!(annotation.anchor === refPart)
    );
    const onContainingParagraph = (doc.annotations || []).filter(
      (annotation) =>
        refPart.split(".l").length > 1 &&
        annotation.anchor === refPart.split(".l")[0]
    );
    const childOfFocused = (doc.annotations || []).filter(
      (annotation) =>
        annotation.anchor.startsWith(refPart) && annotation.anchor !== refPart
    );

    return (
      <div className={css.annotatorcontainer}>
        <div className={css.closebutton} onClick={() => this.close()}>
          x
        </div>
        {this.renderFocusString()}
        {annotations.map((anno, i) => this.renderAnnotation(anno, i, false))}
        {this.state.editing ? (
          <Editor
            docRef={docRef}
            onClose={() => this.setState({ editing: false })}
          />
        ) : (
          this.renderCreateNew()
        )}
        {onContainingParagraph.length > 0 && (
          <div>
            Containing paragraph
            {onContainingParagraph.map((anno, i) =>
              this.renderAnnotation(anno, i, false)
            )}
          </div>
        )}
        {childOfFocused.length > 0 && (
          <div>
            {childOfFocused.map((anno, i) =>
              this.renderAnnotation(anno, i, true)
            )}
          </div>
        )}
      </div>
    );
  }

  private close() {
    this.props.history.push(this.props.focus.docRef.docId);
  }

  private renderFocusString(): string {
    var terms: string[] = [];
    const docRef = this.props.focus.docRef;
    if (docRef.section) terms.push(`section ${docRef.section}`);
    if (docRef.paragraph) terms.push(`paragraph ${docRef.paragraph}`);
    if (docRef.line) terms.push(`line ${docRef.line}`);

    return `Selected (${terms.join(", ")})`;
  }

  private renderCreateNew(): JSX.Element {
    return (
      <div
        className={css.newannotation}
        onClick={() => this.setState({ editing: true })}
      >
        Create new
      </div>
    );
  }

  private renderToken(
    tok: IAnnotationTokenText | IAnnotationTokenLink | IAnnotationTokenDocRef,
    key: number
  ) {
    const docRef = (tok as IAnnotationTokenDocRef).docRef;
    const link = (tok as IAnnotationTokenLink).link;
    const text = (tok as IAnnotationTokenText).text;
    if (docRef)
      return (
        <Link to={`/doc/${docRef}`} key={key}>
          <span className={css.link}>
            {this.props.docs.graph[docRef] ? (
              this.props.docs.graph[docRef].title
            ) : (
              <span style={{ color: "red" }}>{docRef}</span>
            )}
          </span>
        </Link>
      );
    else if (link)
      return (
        <a className={css.externallink} href={link} key={key}>
          {text}
        </a>
      );
    else return <span key={key}>{text}</span>;
  }

  private renderAnnotation(
    annotation: IAnnotation,
    key: number,
    withTitle: boolean
  ): JSX.Element {
    const el = document.getElementById(annotation.anchor);
    var text = el && el.textContent;
    if (!text) text = annotation.anchor;

    return (
      <div className={css.relatedannotation} key={key}>
        {withTitle ? <div className={css.title}>{text}</div> : null}
        <div className={css.annotation}>
          {annotation.tokens.map((tok, i) => this.renderToken(tok, i))}
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state: IAppState, ownProps) => ({
  focus: state.focus,
  docs: state.docs,
});

export default connect(mapStateToProps, {})(withRouter(Annotator));
