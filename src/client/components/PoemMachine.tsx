import * as React from "react";
import { connect } from "react-redux";
import { RouteComponentProps } from "react-router";
import ScrollMemory from 'react-router-scroll-memory';
import { getGraph, getSearchResults } from "../api";
import { setGraph, setFocus, setSearch } from "../actions";
import FocusContent from "./FocusContent";
import NavTree from "./NavTree";
import SearchBox from "./SearchBox";
import { IDocReference } from "../../shared/IApiTypes";
import { DeserializeDocRef } from "../../shared/util";
import { IFocusState } from "../model";

const css = require("./all.css");

interface IMatchParams {
  docId?: string;
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
    const { docId, searchTerm } = this.props.match.params;
    const part = this.props.location.hash;
    const docRef: IDocReference = DeserializeDocRef(`${docId}${part}`);
    const newFocus: IFocusState = {
      docRef
    };

    // If the new route includes a hash fragment, we need to scroll it into view after render
    if (part) newFocus.waitingToScroll = true;

    if (docId) this.props.setFocus(newFocus);
    else if (searchTerm) {
      const searchResults = await getSearchResults(searchTerm);
      this.props.setSearch(searchResults);
      this.props.setFocus({
        search: true
      });
    }
  }

  public render() {
    const navpaneClasses = [css.navpane];
    if (!this.state.navactive) navpaneClasses.push(css.navinactive);

    return (
      <div className={css.poemmachine}>
        {!this.state.navactive ? (
          <div
            className={css.navtogglebar}
            onClick={() => this.setState({ navactive: true })}
          >
            <div className={css.navtogglebar_text}>:: browse ::</div>
          </div>
        ) : null}
        <div className={navpaneClasses.join(" ")}>
          <div className={css.navsection}>
            <SearchBox />
          </div>
          <div className={css.navsection}>
            <NavTree />
          </div>
        </div>
        <div
          id='viewpane'
          className={css.viewpane}
          onClick={() => this.setState({ navactive: false })}
        >
          <ScrollMemory elementID='viewpane' />
          <FocusContent />
        </div>
      </div>
    );
  }
}

export default connect(null, { setGraph, setFocus, setSearch })(PoemMachine);
