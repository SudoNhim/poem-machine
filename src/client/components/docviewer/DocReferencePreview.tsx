import * as React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { IDocReferencePreview, IDocMeta } from '../../../shared/IApiTypes';
import { IAppState } from '../../model';
import CanonTextView from './CanonTextView';

const css = require('../all.css');

interface IProps {
    docMeta: IDocMeta;
    preview: IDocReferencePreview;
}

const DocReferencePreview: React.FunctionComponent<IProps> = (props) =>  (
    <div>
        <Link to={`/doc/${props.preview.docRef.docId}`}>
            <p className={css.searchhit_title}>
                {props.docMeta.title}
            </p>
        </Link>
        <CanonTextView text={props.preview.preview} />
    </div>
);

const mapStateToProps = (state: IAppState, ownProps) => ({
    docMeta: state.docs.graph[ownProps.preview.docRef.docId],
    preview: ownProps.preview
});

export default connect(mapStateToProps)(DocReferencePreview);
