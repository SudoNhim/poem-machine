import * as React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { IDocReferencePreview, IDocMeta } from '../../../shared/IApiTypes';
import { IAppState } from '../../model';
import CanonTextView from './CanonTextView';

const css = require('./docviewer.css');

interface IProps {
    docMeta: IDocMeta;
    preview: IDocReferencePreview;
}

const DocReferencePreview: React.FunctionComponent<IProps> = (props) => {
    const kind = props.docMeta.kind;
    const prefix = `${kind.charAt(0).toUpperCase()}${kind.substr(1)}`;
    
    return (
        <div className={css.card}>
            <div className={css.reference}>
                {prefix}{' '}
                <Link to={`/doc/${props.preview.docRef.docId}`}>
                    <span className={css.link}>
                        {props.docMeta.title}
                    </span>
                </Link>
            </div>
            <CanonTextView text={props.preview.preview} />
        </div>
    );
}

const mapStateToProps = (state: IAppState, ownProps) => ({
    docMeta: state.docs.graph[ownProps.preview.docRef.docId],
    preview: ownProps.preview
});

export default connect(mapStateToProps)(DocReferencePreview);
