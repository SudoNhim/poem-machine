import * as React from "react";
import { connect } from "react-redux";
import { IAppState, IHoverState } from "../../model";
import { Text } from "cohen-db/schema";
import { setHover } from "../../actions";

const css = require("./docviewer.css");

interface IProps {
  text: Text;
  prefix: string;
  hover: IHoverState;
  setHover: typeof setHover;
}

class CanonTextView extends React.Component<IProps> {
  public render() {
    return (
      <div>
        {this.props.text.text.map((p, pi) => this.renderParagraph(pi, p))}
      </div>
    );
  }

  private renderParagraph(pi: number, text: string | string[]): JSX.Element {
    const id = `${this.props.prefix}p${pi}`;
    const classNames: string[] = [css.canonparagraph];
    if (this.props.hover.docParts && this.props.hover.docParts.indexOf(id) >= 0)
      classNames.push(css.canonhover);

    return <div
      id={id}
      className={classNames.join(" ")}
      key={pi}
      onMouseOver={evt => this.onMouseOver(evt, id)}
      onMouseOut={evt => this.onMouseOut(evt, id)}
    >
      {Array.isArray(text)
      ? text.map((line, li) => this.renderLine(pi, li, line))
      : text}
    </div>
  }

  private renderLine(pi: number, li: number, s: string): JSX.Element {
    const id = `${this.props.prefix}p${pi}.l${li}`;
    const classNames: string[] = [css.canonlinetext];
    if (this.props.hover.docParts && this.props.hover.docParts.indexOf(id) >= 0)
      classNames.push(css.canonhover);

    return <div
      className={css.canonline}
      key={li}
      onMouseOver={evt => this.onMouseOver(evt, id)}
      onMouseOut={evt => this.onMouseOut(evt, id)}
    >
      <span
        id={id}
        className={classNames.join(" ")}
      >{s}</span>
    </div>;
  }

  private onMouseOver(evt: React.MouseEvent, id: string) {
    evt.stopPropagation();
    this.props.setHover({ docParts: [id] });
  }

  private onMouseOut(evt: React.MouseEvent, id: string) {
    evt.stopPropagation();
    this.props.setHover({ });
  }
}

// currently not using redux connection
const mapStateToProps = (state: IAppState, ownProps: IProps) => ({
  text: ownProps.text,
  prefix: ownProps.prefix,
  hover: state.hover
});

export default connect(mapStateToProps, { setHover })(CanonTextView);
