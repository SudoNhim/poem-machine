import * as React from "react";
import { connect } from "react-redux";
import { setDoc, setScrolled } from "../../actions";
import { IAppState, IFocusState } from "../../model";

const css = require("./annotator.css");

interface IProps {
  focus: IFocusState;
}

interface IState {
}

class Annotator extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
  }

  public render() {
    const docRef = this.props.focus.docRef;
    if (docRef && (docRef.line || docRef.paragraph)) {
    return <div className={css.annotatorcontainer}>
        This panel will let you view, create, edit annotations on a selection
        {JSON.stringify(this.props.focus)}
    </div>;
    } else {
        return null;
    }
  }
}

const mapStateToProps = (state: IAppState, ownProps) => ({
  focus: state.focus
});

export default connect(mapStateToProps, { setDoc, setScrolled })(Annotator);
