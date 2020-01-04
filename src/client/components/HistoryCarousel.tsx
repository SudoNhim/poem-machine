import * as React from "react";
import { connect } from "react-redux";
import { IAppState, IFocusStateArray } from "../model";
import SwipableViews from "react-swipeable-views";
import FocusContent from "./FocusContent";

const css = require("./all.css");

interface IProps {
  focusStates: IFocusStateArray;
}

interface IState {}

class HistoryCarousel extends React.Component<IProps, IState> {
  public render() {
    return (
      <SwipableViews
        style={{position:"absolute", top:"0em", bottom:"-0em"}}
        index={this.props.focusStates.index}
      >
        {this.props.focusStates.frames.map((frame, i) => (
          <FocusContent key={i} focus={frame} />
        ))}
      </SwipableViews>
    );
  }
}

const mapStateToProps = (state: IAppState): IProps => ({
  focusStates: state.focus
});

export default connect(mapStateToProps, {})(HistoryCarousel);
