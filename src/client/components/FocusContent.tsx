import * as React from 'react';
import { connect } from 'react-redux';
import { IAppState, IFocusState } from '../model';
import DocViewer from './DocViewer';
import SearchResultsViewer from './SearchResultsViewer';

const css = require('./all.css');

interface IProps {
    focus: IFocusState;
}

const FocusContent: React.FunctionComponent<IProps> = (props) =>  (
    <div className={css.focuscontent}>
        {props.focus.docId ? 
            <DocViewer id={props.focus.docId} key={props.focus.docId}/>
        : props.focus.search ?
            <SearchResultsViewer />
        : <div className={css.viewsection}>"No focus..."</div>}
    </div>
);

const mapStateToProps = (state: IAppState): IProps => ({
    focus: state.focus
});

export default connect(mapStateToProps, {})(FocusContent);