import { Reference } from "cohen-db/schema";
import * as React from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";

import { IDocMeta } from "../../../shared/ApiTypes";
import { SerializeDocRef } from "../../../shared/util";
import { IAppState } from "../../model";

const css = require("../all.css");

interface IProps {
  reference: Reference;
  docMeta: IDocMeta;
}

const Referrer: React.FunctionComponent<IProps> = (props) => (
  <div className={css.referrer}>
    <Link to={`/doc/${SerializeDocRef(props.reference)}`}>
      {props.docMeta.title}
    </Link>{" "}
    ({props.docMeta.kind})
  </div>
);

const mapStateToProps = (state: IAppState, ownProps) => ({
  reference: ownProps.reference,
  docMeta: state.docs.graph[ownProps.id],
});

export default connect(mapStateToProps)(Referrer);
