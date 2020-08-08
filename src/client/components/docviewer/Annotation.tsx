import * as React from "react";
import { IAnnotation } from "../../../shared/IApiTypes";
import { connect } from "react-redux";

const css = require("./docviewer.css");

interface IProps {
    annotation: IAnnotation
}

interface IState {
    hover: boolean
}

class Annotation extends React.Component<IProps, IState> {
    constructor(props: IProps) {
        super(props);
        this.state = {
            hover: false
        }
    }

    public render(): JSX.Element {
        const anchor = document.getElementById(this.props.annotation.canonRefs[0]);
        if (!anchor) return null;
        const style: React.CSSProperties = {
            top: anchor.offsetTop
        };

        for (var ref of this.props.annotation.canonRefs) {
            const el = document.getElementById(ref);
            if (!el) continue;
            if (this.state.hover)
                el.classList.add(css.linkedannotationhover);
            else
                el.classList.remove(css.linkedannotationhover);
        }

        return <div
            className={css.annotation}
            style={style}
            onMouseEnter={() => this.setState({ hover: true })}
            onMouseLeave={() => this.setState({ hover: false })}
            >{this.props.annotation.text}</div>;
    }
}

const mapStateToProps = (state, ownProps: IProps) => ({
    annotation: ownProps.annotation
});

export default connect(mapStateToProps)(Annotation);
