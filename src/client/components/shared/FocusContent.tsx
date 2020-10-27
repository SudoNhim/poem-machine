import * as React from "react";
import { connect } from "react-redux";

import { IAppState, IFocusState } from "../../model";
import DocViewer from "../docviewer/DocViewer";
import SearchResultsViewer from "../SearchResults";

const css = require("../all.css");

interface IProps {
  focus: IFocusState;
  hasGraph: boolean;
}

const FocusContent: React.FunctionComponent<IProps> = (props) => (
  <div className={css.focuscontent}>
    {props.focus.docRef ? (
      <DocViewer id={props.focus.docRef.docId} key={props.focus.docRef.docId} />
    ) : props.focus.search ? (
      <SearchResultsViewer />
    ) : props.hasGraph ? (
      <DocViewer id="db" key="db" />
    ) : (
      <div className={css.viewsection}>Loading...</div>
    )}
  </div>
);

const mapStateToProps = (state: IAppState): IProps => ({
  focus: state.focus,
  hasGraph: state.docs.graph.db.children.length > 0,
});

export default connect(mapStateToProps, {})(FocusContent);
