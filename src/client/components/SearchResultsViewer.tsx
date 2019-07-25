import * as React from 'react';
import { connect } from 'react-redux';
import { IAppState } from '../model';
import { ISearchResults } from '../../shared/IApiTypes';
import SearchHit from './SearchHit';

interface IProps {
    searchResults: ISearchResults
}

const SearchResultsViewer: React.FunctionComponent<IProps> = (props) =>  (
    <div>
        {props.searchResults.hits.map((hit, index) => 
            <SearchHit hit={hit} key={index} />
        )}
    </div>
);

const mapStateToProps = (state: IAppState) => ({
    searchResults: state.search
});

export default connect(mapStateToProps, null)(SearchResultsViewer);