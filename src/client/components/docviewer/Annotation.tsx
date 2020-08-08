import * as React from "react";
import { IAnnotation } from "../../../shared/IApiTypes";
import { connect } from "react-redux";

const css = require("./docviewer.css");

interface IProps {
    annotation: IAnnotation
}

interface IState {
    windowWidth: number;
    windowHeight: number;
}

class Annotation extends React.Component<IProps, IState> {
    private updateDimensionsHandler: () => void;

    constructor(props: IProps) {
        super(props);
        this.state = {
            windowWidth: window.innerWidth,
            windowHeight: window.innerHeight
        }
        this.updateDimensionsHandler = this.updateDimensions.bind(this);
    }

    private updateDimensions() {
        this.setState({ windowWidth: window.innerWidth, windowHeight: window.innerHeight });
    };

    public componentDidMount() {
        window.addEventListener('resize', this.updateDimensionsHandler);
    }

    public componentWillUnmount() {
        window.removeEventListener('resize', this.updateDimensionsHandler);
    }

    public render(): JSX.Element {
        const anchor = document.getElementById(this.props.annotation.canonRefs[0]);
        if (!anchor) return null;
        const style: React.CSSProperties = {
            top: anchor.offsetTop
        };
        return <div className={css.annotation} style={style} >{this.props.annotation.text}</div>;
    }
}

const mapStateToProps = (state, ownProps: IProps) => ({
    annotation: ownProps.annotation
});

export default connect(mapStateToProps)(Annotation);
