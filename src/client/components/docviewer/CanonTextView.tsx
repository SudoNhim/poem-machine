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
        {this.props.text.text.map((p, i) => (
          <div
            id={`${this.props.prefix}p${i + 1}`}
            className={css.canonparagraph}
            key={i}
          >
            {(Array.isArray(p) ? p : [p]).map((l, i2) => (
              <p className={css.canonline} key={i2}>
                <span
                id={`${this.props.prefix}p${i + 1}.l${i2 + 1}`}
                className={css.canonlinetext}
                >
                  {l}
                </span>
              </p>
            ))}
          </div>
        ))}
      </div>
    );
  }
}

// currently not using redux connection
const mapStateToProps = (state: IAppState, ownProps: IProps) => ({
  text: ownProps.text,
  prefix: ownProps.prefix
});

export default connect(mapStateToProps)(CanonTextView);
