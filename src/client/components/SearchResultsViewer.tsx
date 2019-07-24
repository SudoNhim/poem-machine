import * as React from 'react';
import { connect } from 'react-redux';
import { IAppState } from '../model';
import { ISearchResults } from '../../shared/IApiTypes';

interface IProps {
    searchResults: ISearchResults
}

const SearchResultsViewer: React.FunctionComponent<IProps> = (props) =>  (
    <div>
        {JSON.stringify(props.searchResults)}
    </div>
);

const mapStateToProps = (state: IAppState) => ({
    searchResults: state.search
});

export default connect(mapStateToProps, null)(SearchResultsViewer);