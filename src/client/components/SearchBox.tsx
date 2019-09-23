import * as React from 'react';
import { withRouter } from 'react-router-dom';
import { RouteComponentProps } from 'react-router';

const css = require('./all.css');

const SearchBox: React.FunctionComponent<any> = withRouter((props: RouteComponentProps) =>  (
    <div className={css.searchbox_container}>
        <input className={css.searchbox} onKeyDown={async (evt) => {
            if (evt.key === "Enter") {
                props.history.push(`/search/${evt.currentTarget.value}`);
            }
        }} />
    </div>
));

export default SearchBox;