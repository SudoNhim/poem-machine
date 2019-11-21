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
    searchTerm?: string;
}

interface IProps extends RouteComponentProps<IMatchParams> {
    setGraph: typeof setGraph;
    setFocus: typeof setFocus;
    setSearch: typeof setSearch;
}

interface IState {
    navactive: boolean;
}

class PoemMachine extends React.Component<IProps, IState> {
    constructor(props) {
        super(props);
        this.state = {
            navactive: false
        };
    }

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
        if (this.props.match.path === '/doc/*')
            this.props.setFocus({
                docId: this.props.match.params[0]
            });
        else if (this.props.match.params.searchTerm) {
            const searchResults = await getSearchResults(this.props.match.params.searchTerm);
            this.props.setSearch(searchResults);
            this.props.setFocus({
                search: true
            });
        }
    }

    public render() {
        const navpaneClasses = [css.navpane];
        if (!this.state.navactive)
            navpaneClasses.push(css.navinactive);

        return (
        <div className={css.poemmachine}>
            {!this.state.navactive ?
            <div className={css.navtogglebar} onClick={() => this.setState({ navactive: true })}>
                <div className={css.navtogglebar_text}>:: browse ::</div>
            </div>
            : null}
            <div className={navpaneClasses.join(" ")}>
                <div className={css.navsection}><SearchBox /></div>
                <div className={css.navsection}><NavTree /></div>
            </div>
            <div className={css.viewpane} onClick={() => this.setState({ navactive: false })}>
                <FocusContent />
            </div>
        </div>)
    }
}

export default connect(null, { setGraph, setFocus, setSearch })(PoemMachine);