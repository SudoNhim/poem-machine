import * as React from "react";
import { connect } from "react-redux";
import { IDocReference } from "../../../shared/IApiTypes";
import { IAppState } from "../../model";
import DocReference from './DocReference'

const css = require("./docviewer.css");

interface IProps {
  referrers: IDocReference[]
}

class ReferrersView extends React.Component<IProps> {
  public render() {
    return <div>
        Referenced by:
        {this.props.referrers.map((r, i) => <DocReference key={i} reference={r} />)}
      </div>;
  }
}

// currently not using redux connection
const mapStateToProps = (state: IAppState, ownProps: IProps) => ({
    referrers: ownProps.referrers
});

export default connect(mapStateToProps)(ReferrersView);
