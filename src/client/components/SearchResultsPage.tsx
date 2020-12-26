import React from "react";
import { useParams } from "react-router";

import { ISearchResults } from "../../shared/ApiTypes";
import { getSearchResults } from "../api";
import ReferencePreview from "./widgets/ReferencePreview";

const css = require("./all.css");

const emptySearchResults: ISearchResults = {
  term: "",
  hits: [],
  previews: [],
};

const SearchResultsPage: React.FunctionComponent = () => {
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
            <ReferencePreview preview={p} />
          </div>
        ))}
      </div>
    );
};

export default SearchResultsPage;
