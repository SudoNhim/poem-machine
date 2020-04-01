import * as React from "react";
import { IAnnotation } from "../../../shared/IApiTypes";
import { connect } from "react-redux";

const css = require("./docviewer.css");

interface IProps {
    annotations: IAnnotation[];
}

class AnnotationsView extends React.Component<IProps> {
    constructor(props: IProps) {
        super(props);
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
