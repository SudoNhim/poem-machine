import * as React from "react";
import { connect } from "react-redux";
import { IAppState } from "../../model";
import { IAnnotation } from "../../../shared/IApiTypes";

const css = require("./annotator.css");

interface IProps {
  source?: IAnnotation;
  onClose: () => void;
}

interface IState {
  text: string;
}

class Editor extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    const intialText = this.props.source && this.props.source.text;
    this.state = {
      text: intialText || ''
    };
  }

  private onChange(evt: React.ChangeEvent<HTMLTextAreaElement>) {
    this.setState({
      text: evt.target.value
    });
  }

  private onSubmit() {
    this.props.onClose();
  }

  public render() {
    return <div className={css.editor}>
        <form onSubmit={() => this.onSubmit()}>
          <textarea className={css.editortextarea} value={this.state.text} onChange={(evt) => this.onChange(evt)} />
          <input className={css.editorsubmit} type="submit" value="Submit" />
        </form>
      </div>;
  }
}

const mapStateToProps = (state: IAppState, ownProps: IProps) => ({
  focus: state.focus,
  docs: state.docs,
  source: ownProps.source,
  onClose: ownProps.onClose
});

export default connect(mapStateToProps, { })(Editor);
