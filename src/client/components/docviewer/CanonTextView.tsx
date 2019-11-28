import * as React from "react";
import { connect } from "react-redux";
import { IAppState } from "../../model";
import { Text } from "cohen-db/schema";

const css = require("./docviewer.css");

interface IProps {
  text: Text
}

class CanonTextView extends React.Component<IProps> {
  public render() {
    return <div className={css.viewsection + ' ' + css.docviewer_text}>
    {this.props.text.text.map((p, i2) => (
      <div className={css.canonparagraph} key={i2}>{
        Array.isArray(p)
          ? p.map((l, i3) => <div className={css.canonline} key={i3}>{l}</div>)
          : <span>{p}<br /></span>
      }</div>))}</div>;
  }
}

// currently not using redux connection
const mapStateToProps = (state: IAppState, ownProps: IProps) => ({
    text: ownProps.text
});

export default connect(mapStateToProps)(CanonTextView);
