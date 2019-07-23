import * as React from 'react';
import { IDocGraph } from '../../shared/IApiTypes';
import * as api from '../api';
import NavTree from './NavTree';

interface IState {
    graph: IDocGraph;
}

export class PoemMachine extends React.Component<any, IState> {
    constructor(props) {
        super(props);
        this.state = {
            graph: {
                dynamicCollectionRoot: {
                    kind: "root",
                    title: "Graph is not loaded..."
                }
            }
        };
    }

    public async componentDidMount() {
        const graph = await api.getGraph();
        this.setState({ graph });
    }

    public render() {
        return (
        <div className="poem-machine">
            <div className="nav-pane"><NavTree graph={this.state.graph} /></div>
            <div className="content-pane">Content Pane</div>
        </div>)
    }
}
