import * as React from "react";
import { connect } from "react-redux";
import { RouteComponentProps } from "react-router";
import { Link } from "react-router-dom";
import { withRouter } from "react-router-dom";

import {
  IAnnotation,
  IAnnotationTokenDocRef,
  IAnnotationTokenLink,
  IAnnotationTokenText,
  IDocGraph,
} from "../../../shared/IApiTypes";
import { setHover } from "../../actions";
import { IAppState, IFocusState, IHoverState } from "../../model";

const css = require("./docviewer.css");

interface IProps extends RouteComponentProps {
  annotation: IAnnotation;
  hover: IHoverState;
  focus: IFocusState;
  graph: IDocGraph;
  setHover: typeof setHover;
}

class Annotation extends React.Component<IProps> {
  constructor(props: IProps) {
    super(props);
  }

  private onHover() {
    this.props.setHover({
      docParts: [this.props.annotation.anchor],
    });
  }

  private onClick(evt: React.MouseEvent) {
    evt.stopPropagation();
    const id = this.props.annotation.anchor;
    const base = `/doc/${this.props.focus.docRef.docId}`;
    if (this.props.location.hash === `#${id}`) this.props.history.push(base);
    else this.props.history.push(`${base}#${id}`);
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
        <Link
          to={`/doc/${docRef}`}
          key={key}
          onClick={(e) => e.stopPropagation()}
        >
          <span className={css.link}>
            {this.props.graph[docRef] ? (
              this.props.graph[docRef].title
            ) : (
              <span style={{ color: "red" }}>{docRef}</span>
            )}
          </span>
        </Link>
      );
    else if (link)
      return (
        <a
          className={css.externallink}
          href={link}
          onClick={(e) => e.stopPropagation()}
          key={key}
        >
          {text}
        </a>
      );
    else return <span key={key}>{text}</span>;
  }

  public render(): JSX.Element {
    const classNames: string[] = [css.annotation];
    const containerClassNames: string[] = [css.annotationcontainer];
    if (this.props.hover.docParts) {
      if (
        this.props.hover.docParts.indexOf(this.props.annotation.anchor) >= 0
      ) {
        classNames.push(css.annotationhover);
        containerClassNames.push(css.annotationcontainerhover);
      }
    }

    return (
      <div
        className={classNames.join(" ")}
        onMouseEnter={() => this.onHover()}
        onMouseLeave={() => this.props.setHover({})}
        onClick={(evt) => this.onClick(evt)}
      >
        {this.props.annotation.tokens.map((tok, i) => this.renderToken(tok, i))}
      </div>
    );
  }
}

const mapStateToProps = (state: IAppState, ownProps) => ({
  annotation: ownProps.annotation,
  hover: state.hover,
  focus: state.focus,
  graph: state.docs.graph,
});

export default connect(mapStateToProps, { setHover })(withRouter(Annotation));
