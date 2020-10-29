import { Text } from "cohen-db/schema";
import * as React from "react";
import { connect } from "react-redux";
import { RouteComponentProps } from "react-router";
import { withRouter } from "react-router-dom";

import { IAnnotation } from "../../../shared/IApiTypes";
import { setHover } from "../../actions";
import { IAppState, IFocusState, IHoverState } from "../../model";

const css = require("./docviewer.css");

interface IProps extends RouteComponentProps {
  docId: string;
  annotations: IAnnotation[];
  focusPart: string;
  text: Text;
  prefix: string;
  hover: IHoverState;
  focus: IFocusState;
  setHover: typeof setHover;
}

class CanonTextView extends React.Component<IProps> {
  public render() {
    return (
      <div>
        {this.props.text.text.map((p, i) => this.renderParagraph(i + 1, p))}
      </div>
    );
  }

  private renderParagraph(pi: number, text: string | string[]): JSX.Element {
    const id = `${this.props.prefix}p${pi}`;
    const classNames: string[] = [css.canonparagraph];
    // if (this.props.hover.docParts && this.props.hover.docParts.indexOf(id) >= 0)
    //  classNames.push(css.canonhover);
    if (this.props.focusPart === id) classNames.push(css.canonfocus);

    return (
      <div
        id={id}
        className={classNames.join(" ")}
        key={pi}
        onMouseOver={(evt) => this.onMouseOver(evt, id)}
        onMouseOut={(evt) => this.onMouseOut(evt, id)}
        onMouseUp={(evt) => this.onMouseUp(evt, id)}
      >
        {Array.isArray(text)
          ? text.map((line, i) => [
              this.renderLine(pi, i + 1, line),
              <br key={-i} />,
            ])
          : text}
      </div>
    );
  }

  private renderLine(pi: number, li: number, s: string): JSX.Element {
    const id = `${this.props.prefix}p${pi}.l${li}`;
    const classNames: string[] = [css.canonlinetext];

    if (this.props.hover.docParts && this.props.hover.docParts.indexOf(id) >= 0)
      classNames.push(css.canonhover);
    else if (this.props.focusPart === id) classNames.push(css.canonfocus);
    else if (this.props.annotations.find((anno) => anno.anchor === id))
      classNames.push(css.annotationmarker);

    return (
      <div
        className={css.canonline}
        key={li}
        onMouseOver={(evt) => this.onMouseOver(evt, id)}
        onMouseOut={(evt) => this.onMouseOut(evt, id)}
        onMouseUp={(evt) => this.onMouseUp(evt, id)}
      >
        <span id={id} className={classNames.join(" ")}>
          {s}
        </span>
      </div>
    );
  }

  private onMouseOver(evt: React.MouseEvent, id: string) {
    evt.stopPropagation();
    this.props.setHover({ docParts: [id] });
  }

  private onMouseOut(evt: React.MouseEvent, id: string) {
    evt.stopPropagation();
    this.props.setHover({});
  }

  private onMouseUp(evt: React.MouseEvent, id: string) {
    evt.stopPropagation();
    const base = `/doc/${this.props.docId}`;
    if (this.props.location.hash === `#${id}`) this.props.history.push(base);
    else this.props.history.push(`${base}#${id}`);
  }
}

const mapStateToProps = (state: IAppState, ownProps) => ({
  docId: ownProps.docId,
  text: ownProps.text,
  prefix: ownProps.prefix,
  hover: state.hover,
  focus: state.focus,
  focusPart: ownProps.focusPart,
  annotations: ownProps.annotations,
});

export default connect(mapStateToProps, { setHover })(
  withRouter(CanonTextView)
);
