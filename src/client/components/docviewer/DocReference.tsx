import * as React from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { IAppState } from "../../model";
import { IDocReference, IDocMeta } from "../../../shared/IApiTypes";

const css = require("./docviewer.css");

interface IProps {
  reference: IDocReference;
  meta: IDocMeta;
}

class DocReference extends React.Component<IProps> {
  public render() {
    return (
      <div>
        <Link to={`/doc/${this.props.reference.docId}`}>
          {this.props.meta.title}
        </Link>
      </div>
    );
  }
}

// currently not using redux connection
const mapStateToProps = (state: IAppState, ownProps) => ({
  reference: ownProps.reference,
  meta: state.docs.graph[ownProps.reference.docId]
});

export default connect(mapStateToProps)(DocReference);
