import * as React from 'react';
import { connect } from 'react-redux';
import { getGraph } from '../api';
import { setGraph } from '../actions';
import NavTree from './NavTree';

const css = require('./all.css');

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
        <div className={css.poemmachine}>
            <div className={css.navpane}><NavTree /></div>
            <div className={css.contentpane}>Content Pane</div>
        </div>)
    }
}

export default connect(null, { setGraph })(PoemMachine);