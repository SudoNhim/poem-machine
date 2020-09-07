import * as React from "react";
import { connect } from "react-redux";
import { IAppState } from "../../model";
import { IAnnotation, IDocReference } from "../../../shared/IApiTypes";
import { setAnnotation } from "../../actions";
import { SerializeDocRef } from "../../../shared/util";
import * as api from "../../api";

const css = require("./annotator.css");

interface IProps {
  source?: IAnnotation; // if updating an existing annotation
  docRef: IDocReference;
  onClose: () => void;
  setAnnotation: typeof setAnnotation;
}

interface IState {
  text: string;
}

class Editor extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    const intialText = '';
    this.state = {
      text: intialText || ''
    };
  }

  private onChange(evt: React.ChangeEvent<HTMLTextAreaElement>) {
    this.setState({
      text: evt.target.value
    });
  }

  private async onSubmit(evt: React.FormEvent<HTMLFormElement>) {
    evt.preventDefault();

    const newAnnotation: IAnnotation = {
      anchor: SerializeDocRef(this.props.docRef).split('#')[1],
      tokens: [{ text: this.state.text }]
    };

    await api.setAnnotation(this.props.docRef.docId, newAnnotation);

    this.props.setAnnotation(this.props.docRef.docId, newAnnotation);
    this.props.onClose();
  }

  public render() {
    return <div className={css.editor}>
        <form onSubmit={(evt) => this.onSubmit(evt)}>
          <textarea className={css.editortextarea} value={this.state.text} onChange={(evt) => this.onChange(evt)} />
          <input className={css.editorsubmit} type="submit" value="Submit" />
        </form>
      </div>;
  }
}

const mapStateToProps = (state: IAppState, ownProps) => ({
  focus: state.focus,
  docs: state.docs,
  source: ownProps.source,
  onClose: ownProps.onClose,
  docRef: ownProps.docRef,
});

export default connect(mapStateToProps, { setAnnotation })(Editor);
