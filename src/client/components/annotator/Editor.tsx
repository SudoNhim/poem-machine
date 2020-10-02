import * as React from "react";
import { connect } from "react-redux";

import {
  IAnnotation,
  IAnnotationToken,
  IAnnotationTokenDocRef,
  IDocReference,
} from "../../../shared/IApiTypes";
import { SerializeDocRef } from "../../../shared/util";
import { setAnnotation } from "../../actions";
import * as api from "../../api";
import { IAppState } from "../../model";

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
    const intialText = "";
    this.state = {
      text: intialText || "",
    };
  }

  private onChange(evt: React.ChangeEvent<HTMLTextAreaElement>) {
    this.setState({
      text: evt.target.value,
    });
  }

  private tokenize(str: string): IAnnotationToken[] {
    const out: IAnnotationToken[] = [];
    while (str.length > 0) {
      let textLen = str.length;

      // Match markdown style hyperlinks like [title of page](www.url.com)
      const linkMatch: RegExpMatchArray = str.match(
        /\[([^\[\]]+)\]\(([^)]+)\)/
      );
      if (linkMatch && linkMatch.index !== null) {
        console.log(linkMatch);
        if (linkMatch.index === 0) {
          out.push({
            kind: "link",
            text: linkMatch[1],
            link: linkMatch[2],
          });
          const len = linkMatch[0].length;
          str = str.substr(len);
        }
        textLen = Math.min(textLen, linkMatch.index);
      }

      // Match references to other documents, like #symbol.heart
      const refMatch: RegExpMatchArray = str.match(/#([\w._#]+)/);
      if (refMatch && refMatch.index !== null) {
        console.log(refMatch);
        if (refMatch.index === 0) {
          out.push({
            kind: "docref",
            docRef: refMatch[1],
          });
          const len = refMatch[0].length;
          str = str.substr(len);
        }
        textLen = Math.min(textLen, refMatch.index);
      }

      if (textLen > 0) {
        out.push({
          kind: "text",
          text: str.substr(0, textLen),
        });
        str = str.substr(textLen);
      }
    }

    return out;
  }

  private async onSubmit(evt: React.FormEvent<HTMLFormElement>) {
    evt.preventDefault();

    const newAnnotation: IAnnotation = {
      anchor: SerializeDocRef(this.props.docRef).split("#")[1],
      tokens: this.tokenize(this.state.text),
    };

    await api.setAnnotation(this.props.docRef.docId, newAnnotation);

    this.props.setAnnotation(this.props.docRef.docId, newAnnotation);
    this.props.onClose();
  }

  public render() {
    return (
      <div className={css.editor}>
        <form onSubmit={(evt) => this.onSubmit(evt)}>
          <p>
            Use #type.name syntax to refer to other documents, and
            [text](www.url.com) format for external links
          </p>
          <textarea
            className={css.editortextarea}
            value={this.state.text}
            onChange={(evt) => this.onChange(evt)}
          />
          <input className={css.editorsubmit} type="submit" value="Submit" />
        </form>
      </div>
    );
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
