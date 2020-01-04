import * as React from 'react';
import { connect } from 'react-redux';
import { IAppState, IFocusState } from '../model';
import DocViewer from './docviewer/DocViewer';
import SearchResultsViewer from './SearchResultsViewer';
import { SerializeDocRef } from '../../shared/util';

const css = require('./all.css');

interface IProps {
    focus: IFocusState;
    hasGraph: boolean;
}

const FocusContent: React.FunctionComponent<IProps> = (props) =>  (
    <div className={css.focuscontent}>
        {!props.hasGraph ?
            <div className={css.viewsection}>Loading...</div>
        : props.focus.docRef ? 
            <DocViewer id={props.focus.docRef.docId} key={SerializeDocRef(props.focus.docRef)}/>
        : props.focus.search ?
            <SearchResultsViewer />
        : <div className={css.viewsection}>Empty focus</div>}
    </div>
);

const mapStateToProps = (state: IAppState, ownProps): IProps => ({
    focus: ownProps.focus,
    hasGraph: state.docs.graph.db.children.length > 0
});

export default connect(mapStateToProps, {})(FocusContent);