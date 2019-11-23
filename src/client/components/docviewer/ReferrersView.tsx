import * as React from "react";
import { connect } from "react-redux";
import { IDocReference } from "../../../shared/IApiTypes";
import { IAppState } from "../../model";

const css = require("./docviewer.css");

interface IProps {
  referrers: IDocReference[]
}

class ReferrersView extends React.Component<IProps> {
  public render() {
    return this.props.referrers.length;
  }
}

// currently not using redux connection
const mapStateToProps = (state: IAppState, ownProps: IProps) => ({
    referrers: ownProps.referrers
});

export default connect(mapStateToProps)(ReferrersView);
