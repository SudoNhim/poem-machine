import * as React from "react";
import { IAnnotation } from "../../../shared/IApiTypes";
import { connect } from "react-redux";
import { RouteComponentProps } from "react-router";
import { withRouter } from "react-router-dom";
import { setHover } from "../../actions";
import { IHoverState, IAppState, IFocusState } from "../../model";

const css = require("./docviewer.css");

interface IProps extends RouteComponentProps {
    annotation: IAnnotation;
    hover: IHoverState;
    focus: IFocusState;
    setHover: typeof setHover;
}

interface IState {
}

class Annotation extends React.Component<IProps, IState> {
    constructor(props: IProps) {
        super(props);
        this.state = {
            hover: false
        }
    }

    private onHover() {
        this.props.setHover({
            docParts: this.props.annotation.canonRefs
        });
    }

    private onMouseUp(evt: React.MouseEvent) {
        evt.stopPropagation();
        const id = this.props.annotation.canonRefs[0];
        const base = `/doc/${this.props.focus.docRef.docId}`;
        if (this.props.location.hash === `#${id}`)
          this.props.history.push(base);
        else
          this.props.history.push(`${base}#${id}`);
      } 

    public render(): JSX.Element {
        const classNames: string[] = [css.annotation];
        const containerClassNames: string[] = [css.annotationcontainer];
        if (this.props.hover.docParts) {
            if (this.props.annotation.canonRefs.some(ref => this.props.hover.docParts.indexOf(ref) >= 0)) {
                classNames.push(css.annotationhover);
                containerClassNames.push(css.annotationcontainerhover);
            }
        }

        return <div
                className={classNames.join(" ")}
                onMouseEnter={() => this.onHover()}
                onMouseLeave={() => this.props.setHover({})}
                onMouseUp={(evt) => this.onMouseUp(evt)}
            >
                {this.props.annotation.text}
            </div>;
    }
}

const mapStateToProps = (state: IAppState, ownProps) => ({
    annotation: ownProps.annotation,
    hover: state.hover,
    focus: state.focus
});

export default connect(mapStateToProps, { setHover })(withRouter(Annotation));
