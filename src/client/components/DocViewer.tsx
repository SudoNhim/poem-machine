import * as React from 'react';
import { connect } from 'react-redux';
import { getDoc } from '../api';
import { setDoc } from '../actions';
import { IDoc, IDocMeta } from '../../shared/IApiTypes';
import { IAppState } from '../model';

interface IProps {
    id: string;
    doc: IDoc;
    docMeta: IDocMeta;
    setDoc: typeof setDoc;
}

class DocViewer extends React.Component<IProps> {
    public async componentDidMount() {
        const doc = await getDoc(this.props.id);
        this.props.setDoc(this.props.id, doc);
    }

    public render() {
        if (!this.props.doc)
            return <div>Loading...</div>;
        else {
            return <div>
                <p>{this.props.docMeta.title}</p>
                <p>{this.props.doc.text}</p>
            </div>
        }
    }
}

const mapStateToProps = (state: IAppState, ownProps) => ({
    id: ownProps.id,
    doc: state.docs.cache[ownProps.id],
    docMeta: state.docs.graph[ownProps.id]
});

export default connect(mapStateToProps, { setDoc })(DocViewer);