import * as React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { IDocMeta } from '../../shared/IApiTypes';
import { IAppState } from '../model';

const css = require('./all.css');

interface IProps {
    id: string;
    docMeta: IDocMeta;
}

const Referrer: React.FunctionComponent<IProps> = (props) =>  (
    <div className={css.referrer}>
        <Link to={`/doc/${props.id}`}>{props.docMeta.title}</Link> ({props.docMeta.kind})
    </div>
);

const mapStateToProps = (state: IAppState, ownProps) => ({
    id: ownProps.id,
    docMeta: state.docs.graph[ownProps.id]
});

export default connect(mapStateToProps)(Referrer);