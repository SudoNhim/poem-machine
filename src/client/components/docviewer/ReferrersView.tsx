import * as React from "react";
import { connect } from "react-redux";
import { IDocReferencePreview } from "../../../shared/IApiTypes";
import { IAppState } from "../../model";
import DocReferencePreview from "./DocReferencePreview";

const css = require("./docviewer.css");

interface IProps {
  referrers: IDocReferencePreview[]
}

class ReferrersView extends React.Component<IProps> {
  public render() {
    return <div>
        <div className={css.heading}>Referenced by</div>
        {this.props.referrers.map((r, i) => <DocReferencePreview key={i} preview={r} />)}
      </div>;
  }
}

// currently not using redux connection
const mapStateToProps = (state: IAppState, ownProps: IProps) => ({
    referrers: ownProps.referrers
});

export default connect(mapStateToProps)(ReferrersView);
