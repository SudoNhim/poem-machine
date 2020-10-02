import * as React from "react";
import { connect } from "react-redux";

import { ISearchResults } from "../../shared/IApiTypes";
import { IAppState } from "../model";
import DocReferencePreveiw from "./docviewer/DocReferencePreview";

const css = require("./all.css");

interface IProps {
  searchResults: ISearchResults;
}

const SearchResultsViewer: React.FunctionComponent<IProps> = (props) => (
  <div>
    {props.searchResults.previews.map((p, index) => (
      <div className={css.viewsection} key={index}>
        <DocReferencePreveiw preview={p} />
      </div>
    ))}
  </div>
);

const mapStateToProps = (state: IAppState) => ({
  searchResults: state.search,
});

export default connect(mapStateToProps, null)(SearchResultsViewer);
