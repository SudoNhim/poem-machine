import * as React from 'react';
import { connect } from 'react-redux';
import { ISearchResults } from '../../shared/IApiTypes';
import { IAppState } from '../model';
import NavTreeNode from './NavTreeNode';
import { setSearch, setFocus } from '../actions';

const css = require('./all.css');

interface IProps {
    search: ISearchResults;
    hasFocus: boolean;
    setSearch: typeof setSearch;
    setFocus: typeof setFocus;
}

interface IState {
    expanded: boolean;
}

class SearchTree extends React.Component<IProps, IState> {
    constructor(props) {
        super(props);
        this.state = {
            expanded: false
        };
    }

    private toggleExpand() {
        this.setState({
            expanded: !this.state.expanded
        });
    }

    public render() {
        const children = this.state.expanded ?
            this.props.search.hits.map(hit => hit.id)
            : [];

        const buttonEl = this.props.search.hits.length ?
            <span 
                onClick={() => this.toggleExpand()}
                className={css.navtreenode_button}
            >
                {this.state.expanded ? "[-]" : "[+]"}
            </span>
            : null;

        const childEls = children.map((id, index) => <NavTreeNode id={id} key={index} />);

        const doclinkEl =
            <span
                className={css.navtreenode_doclink}
                onClick={() => this.props.setFocus({search: true})}
            >
                Search
            </span>;

        const titleClasses = [css.navtreenode_title];
        if (this.props.hasFocus)
            titleClasses.push(css.navtreenode_title_focus);

        return (
        <div className={css.navtreenode}>
            <div className={titleClasses.join(" ")}>
                {buttonEl}{doclinkEl}
            </div>
            <div className={css.navtreenode_content}>
                {childEls}
            </div>
        </div>)
    }
}

const mapStateToProps = (state: IAppState) => ({
    search: state.search,
    hasFocus: state.focus.search
});

export default connect(mapStateToProps, { setSearch, setFocus })(SearchTree);