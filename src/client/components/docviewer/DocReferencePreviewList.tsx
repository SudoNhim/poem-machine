import * as React from "react";
import { connect } from "react-redux";

import { IDocReferencePreview } from "../../../shared/IApiTypes";
import { IAppState } from "../../model";
import DocReferencePreview from "./DocReferencePreview";

const css = require("./docviewer.css");

interface IProps {
  previews: IDocReferencePreview[];
}

class DocReferencePreviewList extends React.Component<IProps> {
  public render() {
    return (
      <div>
        {this.props.previews.map((r, i) => (
          <DocReferencePreview key={i} preview={r} />
        ))}
      </div>
    );
  }
}

// currently not using redux connection
const mapStateToProps = (state: IAppState, ownProps: IProps) => ({
  previews: ownProps.previews,
});

export default connect(mapStateToProps)(DocReferencePreviewList);
