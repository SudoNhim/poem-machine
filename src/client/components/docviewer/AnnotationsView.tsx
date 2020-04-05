import * as React from "react";
import { IAnnotation } from "../../../shared/IApiTypes";
import { connect } from "react-redux";

const css = require("./docviewer.css");

interface IProps {
    annotations: IAnnotation[];
}

interface IState {
    windowWidth: number;
    windowHeight: number;
}

class AnnotationsView extends React.Component<IProps, IState> {
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
        return <div className={css.annotations}>
            {this.props.annotations.map((anno, i) => {
                const anchor = document.getElementById(anno.canonRefs[0]);
                if (!anchor) return null;
                const style: React.CSSProperties = {
                    top: anchor.offsetTop
                };
                return <div className={css.annotation} style={style} key={i}>{anno.text}</div>;
            })}
        </div>;
    }
}

const mapStateToProps = (state, ownProps: IProps) => ({
    annotations: ownProps.annotations
});

export default connect(mapStateToProps)(AnnotationsView);
