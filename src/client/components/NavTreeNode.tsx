import * as React from 'react';
import { IDocGraph } from '../../shared/IApiTypes';

interface IProps {
    graph: IDocGraph;
    id: string;
}

interface IState {
    expanded: boolean;
}

class NavTreeNode extends React.Component<IProps, IState> {
    constructor(props) {
        super(props);
        this.state = {
            expanded: false
        };
    }

    public render() {
        return (
        <div className="navtreenode">
            NavTreeNode {this.props.graph[this.props.id].title}
        </div>)
    }
}

export default NavTreeNode;