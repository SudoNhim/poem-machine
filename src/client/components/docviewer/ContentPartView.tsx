import * as React from "react";
import { connect } from "react-redux";
import { IAppState } from "../../model";
import { Prologue, Variation, Note } from "cohen-db/schema";
import { Link } from "react-router-dom";
import CanonTextView from "./CanonTextView";
import { IDocMeta } from "../../../shared/IApiTypes";

const css = require("./docviewer.css");

interface IProps {
  part: Prologue | Variation | Note;
  target: IDocMeta;
}

class ContentPartView extends React.Component<IProps> {
  public render() {
    const prefix = {
      prologue: "Prologue to",
      note: "On",
      variation: "Variation of"
    }[this.props.part.kind];

    return (
      <div>
        {prefix}{" "}
        <Link to={`/doc/${this.props.part.reference}`}>
          {this.props.target.title}
        </Link>
        <CanonTextView text={this.props.part.content} />
      </div>
    );
  }
}

// currently not using redux connection
const mapStateToProps = (state: IAppState, ownProps: IProps) => ({
  part: ownProps.part,
  target: state.docs.graph[ownProps.part.reference]
});

export default connect(mapStateToProps)(ContentPartView);
