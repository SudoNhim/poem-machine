import * as React from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router';
import { getGraph, getSearchResults } from '../api';
import { setGraph, setFocus, setSearch } from '../actions';
import FocusContent from './FocusContent';
import NavTree from './NavTree';
import SearchBox from './SearchBox';

const css = require('./all.css');

interface IMatchParams {
    docId?: string;
    searchTerm?: string;
}

interface IProps extends RouteComponentProps<IMatchParams> {
    setGraph: typeof setGraph;
    setFocus: typeof setFocus;
    setSearch: typeof setSearch;
}

class PoemMachine extends React.Component<IProps> {
    public async componentDidMount() {
        const graph = await getGraph();
        this.props.setGraph(graph);
        this.handleRoute();
    }

    public async componentDidUpdate(prevProps: IProps) {
        if (prevProps.match !== this.props.match) {
            return this.handleRoute();
        }
    }

    private async handleRoute() {
        const { docId, searchTerm } = this.props.match.params;
        if (docId)
            this.props.setFocus({
                docId
            });
        else if (searchTerm) {
            const searchResults = await getSearchResults(searchTerm);
            this.props.setSearch(searchResults);
            this.props.setFocus({
                search: true
            });
        }
    }

    public render() {
        return (
        <div className={css.poemmachine}>
            <div className={css.navtogglebar}><span className={css.navtogglebar_text}>:: browse ::</span></div>
            <div className={css.navpane}>
                <div className={css.navsection}><SearchBox /></div>
                <div className={css.navsection}><NavTree /></div>
            </div>
            <div className={css.viewpane}><FocusContent /></div>
        </div>)
    }
}

export default connect(null, { setGraph, setFocus, setSearch })(PoemMachine);