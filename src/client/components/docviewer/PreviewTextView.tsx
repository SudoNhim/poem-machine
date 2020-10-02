import * as React from "react";
import { connect } from "react-redux";
import { IAppState } from "../../model";
import { Text } from "cohen-db/schema";

const css = require("./docviewer.css");

interface IProps {
  text: Text;
}

// similar to CanonTextView but no annotations, references, highlighting, etc
class PreviewTextView extends React.Component<IProps> {
  public render() {
    return (
      <div>
        {this.props.text.text.map((p, i) => (
          <div className={css.previewparagraph} key={i}>
            {Array.isArray(p)
              ? p.map((l, i2) => (
                  <div className={css.previewline} key={i2}>
                    {l}
                  </div>
                ))
              : p}
          </div>
        ))}
      </div>
    );
  }
}

// currently not using redux connection
const mapStateToProps = (state: IAppState, ownProps: IProps) => ({
  text: ownProps.text,
});

export default connect(mapStateToProps)(PreviewTextView);
