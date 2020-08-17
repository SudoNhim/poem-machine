import * as React from "react";
import { connect } from "react-redux";
import { setDoc, setScrolled } from "../../actions";
import { IAppState, IFocusState, IDocState } from "../../model";
import { IAnnotation } from "../../../shared/IApiTypes";
import { SerializeDocRef } from "../../../shared/util";

const css = require("./annotator.css");

interface IProps {
  focus: IFocusState;
  docs: IDocState;
}

interface IState {
}

class Annotator extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
  }

  public render() {
    const docRef = this.props.focus.docRef;
    if (!docRef || (!docRef.line && !docRef.paragraph))
      return null;
    
    const doc = this.props.docs.cache[docRef.docId];
    if (!doc)
      return null;

    const refPart = SerializeDocRef(docRef).split('#')[1];
    const annotations = (doc.annotations || []).filter(annotation =>
      !!(annotation.canonRefs.find(ref => ref === refPart))
    );
    const onContainingParagraph = (doc.annotations || []).filter(annotation =>
      (refPart.split('.l').length > 1)
      && (!!annotation.canonRefs.find(ref => ref === refPart.split('.l')[0]))
    );
    const childOfFocused = (doc.annotations || []).filter(annotation =>
      (!!annotation.canonRefs.find(ref => ref.startsWith(refPart)))
    );

    return <div className={css.annotatorcontainer}>
      <p>
        {this.renderFocusString()}
        {this.renderCreateNew()}
        {annotations.map((anno, i) => this.renderAnnotation(anno, i))}
      </p>
      {onContainingParagraph.length > 0 && <p>
        Related
        {onContainingParagraph.map((anno, i) => this.renderAnnotation(anno, i))}
      </p>}
      { childOfFocused.length > 0 && <p>
        Related
        {childOfFocused.map((anno, i) => this.renderAnnotation(anno, i))}
      </p>}
    </div>;
  }

  private renderFocusString(): string {
    var terms: string[] = [];
    const docRef = this.props.focus.docRef;
    if (docRef.section)
      terms.push(`section ${docRef.section}`);
    if (docRef.paragraph)
      terms.push(`paragraph ${docRef.paragraph}`);
    if (docRef.line)
      terms.push(`line ${docRef.line}`);

    return `On ${terms.join(', ')}`;
  }

  private renderCreateNew(): JSX.Element {
    return <div className={css.newannotation}>
    Create a new annotation
  </div>;
  }

  private renderAnnotation(annotation: IAnnotation, key: number): JSX.Element {
    return <div className={css.annotation} key={key}>
      {annotation.text}
    </div>;
  }
}

const mapStateToProps = (state: IAppState, ownProps) => ({
  focus: state.focus,
  docs: state.docs
});

export default connect(mapStateToProps, { setDoc, setScrolled })(Annotator);
