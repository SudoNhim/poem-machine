import { Note, Prologue, Variation } from "cohen-db/schema";
import * as React from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";

import { IAnnotation, IDocMeta } from "../../../shared/IApiTypes";
import { IAppState } from "../../model";
import CanonTextView from "./CanonTextView";

const css = require("./docviewer.css");

interface IProps {
  part: Prologue | Variation | Note;
  section: number;
  target: IDocMeta;
  docId: string;
  annotations: IAnnotation[];
  focusPart: string;
}

class ContentPartView extends React.Component<IProps> {
  public render() {
    const titleprefix = {
      prologue: "Prologue to",
      note: "On",
      variation: "Variation of",
    }[this.props.part.kind];

    return (
      <div id={`s${this.props.section}`}>
        <div className={css.reference}>
          {titleprefix}{" "}
          <Link to={`/doc/${this.props.part.reference}`}>
            <span className={css.link}>{this.props.target.title}</span>
          </Link>
        </div>
        {this.props.part.content && (
          <CanonTextView
            prefix={`s${this.props.section}.`}
            text={this.props.part.content}
            docId={this.props.docId}
            focusPart={this.props.focusPart}
            annotations={this.props.annotations}
          />
        )}
      </div>
    );
  }
}

// currently not using redux connection
const mapStateToProps = (state: IAppState, ownProps) => ({
  part: ownProps.part,
  section: ownProps.section,
  target: state.docs.graph[ownProps.part.reference],
  docId: ownProps.docId,
  annotations: ownProps.annotations,
  focusPart: ownProps.focusPart,
});

export default connect(mapStateToProps)(ContentPartView);
