import * as React from 'react';
import { connect } from 'react-redux';
import { IDocGraph } from '../../shared/IApiTypes';
import { IAppState } from '../model';

const css = require('./all.css');

interface IProps {
    id: string;
    graph: IDocGraph;
    highlights: string[],
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

        return (
        <div className={css.navtreenode}>
            <span onClick={() => this.toggleExpand()}>E/C</span>
            NavTreeNode {this.props.graph[this.props.id].title}
            {children.map((id, index) => <NavTreeNode id={id} key={index} />)}
        </div>)
    }
}

const mapStateToProps = (state: IAppState, ownProps): IProps => ({
    id: ownProps.id,
    graph: state.docs.graph,
    highlights: state.search.hits.map(hit => hit.id)
});

const NavTreeNode = connect(mapStateToProps, {})(NavTreeNodeImpl);
export default NavTreeNode;