import * as React from "react";
import { IAnnotation } from "../../../shared/IApiTypes";
import { connect } from "react-redux";
import Annotation from "./Annotation";
import { IHoverState, IAppState } from "../../model";

const css = require("./docviewer.css");

interface IProps {
  annotations: IAnnotation[];
  anchor: string;
  hover: IHoverState;
}

class AnnotationsGroup extends React.Component<IProps> {
  constructor(props: IProps) {
    super(props);
  }

  public render(): JSX.Element {
    const anchor = document.getElementById(this.props.anchor);
    if (!anchor) return null;
    const style: React.CSSProperties = {
      top: anchor.offsetTop,
    };

    const classNames = [css.annotationsgroup];
    if (
      this.props.hover.docParts &&
      this.props.hover.docParts.indexOf(this.props.anchor) >= 0
    )
      classNames.push(css.annotationsgrouphover);

    return (
      <div className={classNames.join(" ")} style={style}>
        {this.props.annotations.map((anno, i) => (
          <Annotation annotation={anno} key={i} />
        ))}
      </div>
    );
  }
}

const mapStateToProps = (state: IAppState, ownProps) => ({
  annotations: ownProps.annotations,
  anchor: ownProps.anchor,
  hover: state.hover,
});

export default connect(mapStateToProps)(AnnotationsGroup);
