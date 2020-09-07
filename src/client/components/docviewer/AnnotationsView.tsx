import * as React from "react";
import { IAnnotation } from "../../../shared/IApiTypes";
import { connect } from "react-redux";
import AnnotationsGroup from "./AnnotationsGroup";

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
        const groups = [...new Set(this.props.annotations.map(anno => anno.canonRefs[0]))].sort()
            .map(anchor => ({
                anchor,
                annotations: this.props.annotations.filter(anno => anno.canonRefs[0] === anchor)
            }));

        return <div className={css.annotations}>
            {groups.map(grp => <AnnotationsGroup anchor={grp.anchor} annotations={grp.annotations} key={grp.anchor} />)}
        </div>;
    }
}

const mapStateToProps = (state, ownProps: IProps) => ({
    annotations: ownProps.annotations
});

export default connect(mapStateToProps)(AnnotationsView);
