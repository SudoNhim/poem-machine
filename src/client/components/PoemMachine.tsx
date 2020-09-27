import * as React from "react";
import { connect } from "react-redux";
import { RouteComponentProps } from "react-router";
import ScrollMemory from 'react-router-scroll-memory';
import { getGraph, getSearchResults } from "../api";
import { setGraph, setFocus, setSearch, setNavPaneOpen } from "../actions";
import FocusContent from "./FocusContent";
import Annotator from "./annotator/Annotator";
import { IDocReference } from "../../shared/IApiTypes";
import { DeserializeDocRef } from "../../shared/util";
import { IFocusState, IAppState } from "../model";
import MuiNavTree from "./mui/MuiNavTree";

const css = require("./all.css");

interface IMatchParams {
  docId?: string;
  searchTerm?: string;
}

interface IProps extends RouteComponentProps<IMatchParams> {
  focus: IFocusState;
  navactive: boolean;
  setGraph: typeof setGraph;
  setFocus: typeof setFocus;
  setSearch: typeof setSearch;
  setNavPaneOpen: typeof setNavPaneOpen;
}

class PoemMachine extends React.Component<IProps> {
  constructor(props) {
    super(props);
  }

  public async componentDidMount() {
    const graph = await getGraph();
    this.props.setGraph(graph);
    this.handleRoute(true);
  }

  public async componentDidUpdate(prevProps: IProps) {
    if (prevProps.match !== this.props.match) {
      return this.handleRoute(this.props.history.action === 'PUSH');
    }
  }

  private async handleRoute(isPush: boolean) {
    const { docId, searchTerm } = this.props.match.params;
    const part = this.props.location.hash;
    const docRef: IDocReference = DeserializeDocRef(`${docId}${part}`);
    const newFocus: IFocusState = {
      docRef
    };

    // If the new route includes a hash fragment, we need to scroll it into view after render
    // (but only if navigating to a new document)
    const curDocId = this.props.focus.docRef && this.props.focus.docRef.docId;
    if (part && isPush && docId !== curDocId) newFocus.waitingToScroll = true;

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
    if (!this.props.navactive) navpaneClasses.push(css.navinactive);

    return (
      <div className={css.poemmachine}>
        <div className={navpaneClasses.join(" ")}>
          <div className={css.navsection}>
            <MuiNavTree />
          </div>
        </div>
        <div
          id='viewpane'
          className={css.viewpane}
          onClick={() => this.props.setNavPaneOpen(false)}
        >
          <ScrollMemory elementID='viewpane' />
          <FocusContent />
        </div>
        <Annotator />
      </div>
    );
  }
}

const mapStateToProps = (state: IAppState) => ({
  focus: state.focus,
  navactive: !!state.ui.navPaneOpen
});

export default connect(mapStateToProps, { setGraph, setFocus, setSearch, setNavPaneOpen })(PoemMachine);
