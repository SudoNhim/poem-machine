import * as React from 'react';
import { connect } from 'react-redux';
import { IDocGraph } from '../../shared/IApiTypes';
import { IAppState } from '../model';

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

const mapStateToProps = (state: IAppState, ownProps): IProps => ({
    graph: state.docs.graph,
    id: ownProps.id
});

export default connect(mapStateToProps, {})(NavTreeNode);