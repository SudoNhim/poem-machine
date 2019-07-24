import * as React from 'react';
import { connect } from 'react-redux';
import { IDocGraph } from '../../shared/IApiTypes';
import { IAppState } from '../model';
import { setFocus } from '../actions';
import ExpandButton from './ExpandButton';

const css = require('./all.css');

interface IProps {
    id: string;
    graph: IDocGraph;
    highlights: string[];
    hasFocus: boolean;
    setFocus: typeof setFocus;
}

interface IState {
    expanded: boolean;
}

class NavTreeNodeImpl extends React.Component<IProps, IState> {
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
        const node = this.props.graph[this.props.id];

        let children: string[] = [];
        if (this.state.expanded)
            children = node.children || [];
        else if (node.kind === "DynamicCollection") {
            children = (node.children || []).filter(id => this.props.highlights.indexOf(id) !== -1);
        }

        const childEls = children.map((id, index) => <NavTreeNode id={id} key={index} />);

        const doclinkEl =
            <span
                className={css.navtreenode_doclink}
                onClick={() => this.props.setFocus({docId: this.props.id})}
            >
                {node.title}
            </span>;

        const titleClasses = [css.navtreenode_title];
        if (this.props.highlights.indexOf(this.props.id) !== -1)
            titleClasses.push(css.navtreenode_title_highlight);
        if (this.props.hasFocus)
            titleClasses.push(css.navtreenode_title_focus);

        const buttonEl = <ExpandButton
            expanded={this.state.expanded}
            canExpand={true}
            onClick={() => this.toggleExpand()} />;

    {doclinkEl}

        return (
        <div className={css.navtreenode}>
            <div className={titleClasses.join(" ")}>
                {node.children && node.children.length ?
                    buttonEl : null}
                {doclinkEl}
            </div>
            <div className={css.navtreenode_content}>
                {childEls}
            </div>
        </div>)
    }
}

const mapStateToProps = (state: IAppState, ownProps) => ({
    id: ownProps.id,
    graph: state.docs.graph,
    highlights: state.search.hits.map(hit => hit.id),
    hasFocus: (state.focus.docId === ownProps.id)
});

const NavTreeNode = connect(mapStateToProps, { setFocus })(NavTreeNodeImpl);
export default NavTreeNode;