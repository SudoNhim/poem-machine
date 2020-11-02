import React from "react";
import { useParams } from "react-router";

import { ISearchResults } from "../../shared/IApiTypes";
import { getSearchResults } from "../api";
import DocReferencePreveiw from "./document/DocReferencePreview";

const css = require("./all.css");

const emptySearchResults: ISearchResults = {
  term: "",
  hits: [],
  previews: [],
};

const SearchResults: React.FunctionComponent = () => {
  const { searchTerm }: { searchTerm: string } = useParams();
  const [results, setResults] = React.useState(emptySearchResults);

  React.useEffect(() => {
    (async () => setResults(await getSearchResults(searchTerm)))();
  }, [searchTerm]);

  if (results?.term !== searchTerm) return <div>Loading search results...</div>;
  else
    return (
      <div>
        {results.previews.map((p, index) => (
          <div className={css.viewsection} key={index}>
            <DocReferencePreveiw preview={p} />
          </div>
        ))}
      </div>
    );
};

export default SearchResults;
