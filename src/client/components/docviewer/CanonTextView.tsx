import * as React from "react";
import { connect } from "react-redux";
import { IAppState } from "../../model";
import { Text } from "cohen-db/schema";

const css = require("./docviewer.css");

interface IProps {
  text: Text;
  prefix: string;
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
    return <div id={id} className={css.canonparagraph} key={pi}>
      {Array.isArray(text)
      ? text.map((line, li) => this.renderLine(pi, li, line))
      : text}
    </div>
  }

  private renderLine(pi: number, li: number, s: string): JSX.Element {
    const id = `${this.props.prefix}p${pi}.l${li}`;
    return <p className={css.canonline} key={li}>
      <span id={id} className={css.canonlinetext}>{s}</span>
    </p>;
  }
}

// currently not using redux connection
const mapStateToProps = (state: IAppState, ownProps: IProps) => ({
  text: ownProps.text,
  prefix: ownProps.prefix
});

export default connect(mapStateToProps)(CanonTextView);
