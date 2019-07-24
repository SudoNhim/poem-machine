import * as React from 'react';
import { connect } from 'react-redux';
import { getGraph } from '../api';
import { setGraph } from '../actions';
import NavTree from './NavTree';

interface IProps {
    setGraph: typeof setGraph;
}

class PoemMachine extends React.Component<IProps> {
    public async componentDidMount() {
        const graph = await getGraph();
        this.props.setGraph(graph);
    }

    public render() {
        return (
        <div className="poem-machine">
            <div className="nav-pane"><NavTree /></div>
            <div className="content-pane">Content Pane</div>
        </div>)
    }
}

export default connect(null, { setGraph })(PoemMachine);