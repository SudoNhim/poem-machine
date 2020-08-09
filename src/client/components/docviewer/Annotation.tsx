import * as React from "react";
import { IAnnotation, IDocReference } from "../../../shared/IApiTypes";
import { connect } from "react-redux";
import { setHover } from "../../actions";
import { IHoverState, IFocusState, IAppState } from "../../model";

const css = require("./docviewer.css");

interface IProps {
    annotation: IAnnotation;
    hover: IHoverState;
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

    public render(): JSX.Element {
        const anchor = document.getElementById(this.props.annotation.canonRefs[0]);
        if (!anchor) return null;
        const style: React.CSSProperties = {
            top: anchor.offsetTop
        };

        const classNames: string[] = [css.annotation];
        if (this.props.hover.docParts) {
            if (this.props.annotation.canonRefs.some(ref => this.props.hover.docParts.indexOf(ref) >= 0))
                classNames.push(css.annotationhover);
        }

        return <div
            className={classNames.join(" ")}
            style={style}
            onMouseEnter={() => this.onHover()}
            onMouseLeave={() => this.props.setHover({})}
            >{this.props.annotation.text}</div>;
    }
}

const mapStateToProps = (state: IAppState, ownProps) => ({
    annotation: ownProps.annotation,
    hover: state.hover
});

export default connect(mapStateToProps, { setHover })(Annotation);
