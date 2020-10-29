import * as React from "react";
import { connect } from "react-redux";
import { RouteComponentProps } from "react-router";

import { IDocReference } from "../../shared/IApiTypes";
import { DeserializeDocRef } from "../../shared/util";
import { setFocus, setGraph, setSideBarOpen } from "../actions";
import { getGraph } from "../api";
import { IAppState, IFocusState } from "../model";
import Annotator from "./annotator/Annotator";
import FocusContent from "./shared/FocusContent";

const css = require("./all.css");

interface IMatchParams {
  docId?: string;
}

interface IProps extends RouteComponentProps<IMatchParams> {
  focus: IFocusState;
  navactive: boolean;
  setGraph: typeof setGraph;
  setFocus: typeof setFocus;
  setSideBarOpen: typeof setSideBarOpen;
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
      return this.handleRoute(this.props.history.action === "PUSH");
    }
  }

  private async handleRoute(isPush: boolean) {
    const { docId } = this.props.match.params;
    const part = this.props.location.hash;
    const docRef: IDocReference = DeserializeDocRef(`${docId}${part}`);
    const newFocus: IFocusState = {
      docRef,
    };

    // If the new route includes a hash fragment, we need to scroll it into view after render
    // (but only if navigating to a new document)
    const curDocId = this.props.focus.docRef && this.props.focus.docRef.docId;
    if (part && isPush && docId !== curDocId) newFocus.waitingToScroll = true;
  }

  public render() {
    const navpaneClasses = [css.navpane];
    if (!this.props.navactive) navpaneClasses.push(css.navinactive);

    return (
      <div>
        <FocusContent />
        <Annotator />
      </div>
    );
  }
}

const mapStateToProps = (state: IAppState) => ({
  focus: state.focus,
  navactive: !!state.ui.navPaneOpen,
});

export default connect(mapStateToProps, {
  setGraph,
  setFocus,
  setSideBarOpen,
})(PoemMachine);
