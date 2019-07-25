import * as React from 'react';
import { connect } from 'react-redux';
import { ISearchResults } from '../../shared/IApiTypes';
import { IAppState } from '../model';
import NavTreeNode from './NavTreeNode';
import ExpandButton from './ExpandButton';
import { setFocus } from '../actions';

const css = require('./all.css');

interface IProps {
    search: ISearchResults;
    hasFocus: boolean;
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

        const childEls = children.map((id, index) => <NavTreeNode id={id} key={index} />);

        const doclinkEl =
            <span
                className={css.navtreenode_doclink}
                onClick={() => this.props.setFocus({search: true})}
            >
                {this.props.search.term || "No search..."}
            </span>;

        const titleClasses = [css.navtreenode_title];
        if (this.props.hasFocus)
            titleClasses.push(css.navtreenode_title_focus);

        return (
        <div className={css.navtreenode}>
            <div className={titleClasses.join(" ")}>
                <ExpandButton
                    expanded={this.state.expanded}
                    canExpand={this.props.search.hits.length > 0}
                    onClick={() => this.toggleExpand()}
                />
                {doclinkEl}
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

export default connect(mapStateToProps, { setFocus })(SearchTree);