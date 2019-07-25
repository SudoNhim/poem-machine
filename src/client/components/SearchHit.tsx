import * as React from 'react';
import { connect } from 'react-redux';
import { setFocus } from '../actions';
import { ISearchHit, IDocMeta } from '../../shared/IApiTypes';
import { IAppState } from '../model';

const css = require('./all.css');

interface IProps {
    hit: ISearchHit;
    docMeta: IDocMeta;
    setFocus: typeof setFocus;
}

const SearchHit: React.FunctionComponent<IProps> = (props) =>  (
    <div className={css.searchhit}>
        <p>{props.docMeta.title}</p>
        {props.hit.preview}
    </div>
);

const mapStateToProps = (state: IAppState, ownProps) => ({
    hit: ownProps.hit,
    docMeta: state.docs.graph[ownProps.hit.id]
});

export default connect(mapStateToProps, { setFocus })(SearchHit);