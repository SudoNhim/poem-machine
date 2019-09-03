import * as React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { ISearchHit, IDocMeta } from '../../shared/IApiTypes';
import { IAppState } from '../model';

const css = require('./all.css');

interface IProps {
    hit: ISearchHit;
    docMeta: IDocMeta;
}

const SearchHit: React.FunctionComponent<IProps> = (props) =>  (
    <div className={css.searchhit}>
        <Link to={`/doc/${props.hit.id}`}>
            <p className={css.searchhit_title}>
                {props.docMeta.title}
            </p>
        </Link>
        {(props.hit.preview || "").split("\n").map(l =>
            <p className={css.searchhit_preview}>{l}</p>)}
    </div>
);

const mapStateToProps = (state: IAppState, ownProps) => ({
    hit: ownProps.hit,
    docMeta: state.docs.graph[ownProps.hit.id]
});

export default connect(mapStateToProps)(SearchHit);