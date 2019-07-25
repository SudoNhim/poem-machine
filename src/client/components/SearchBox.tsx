import * as React from 'react';
import { connect } from 'react-redux';
import { setSearch, setFocus } from '../actions';
import { getSearchResults } from '../api';

const css = require('./all.css');

interface IProps {
    setSearch: typeof setSearch;
    setFocus: typeof setFocus;
}

const SearchBox: React.FunctionComponent<IProps> = (props) =>  (
    <div className={css.searchbox_container}>
        <input className={css.searchbox} onKeyDown={async (evt) => {
            if (evt.key === "Enter") {
                const searchResults = await getSearchResults(evt.currentTarget.value);
                props.setSearch(searchResults);
                props.setFocus({ search: true });
            }
        }} />
    </div>
);

export default connect(null, { setSearch, setFocus })(SearchBox);