import * as React from "react";
import { Link } from 'react-router-dom';
import { IAnnotation, IAnnotationTokenText, IAnnotationTokenDocRef, IAnnotationTokenLink, IDocGraph } from "../../../shared/IApiTypes";
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
    graph: IDocGraph;
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
            docParts: [this.props.annotation.anchor]
        });
    }

    private onMouseUp(evt: React.MouseEvent) {
        evt.stopPropagation();
        const id = this.props.annotation.anchor;
        const base = `/doc/${this.props.focus.docRef.docId}`;
        if (this.props.location.hash === `#${id}`)
          this.props.history.push(base);
        else
          this.props.history.push(`${base}#${id}`);
      }

    private renderToken(tok: (IAnnotationTokenText|IAnnotationTokenLink|IAnnotationTokenDocRef), key: number) {
        const docRef = (tok as IAnnotationTokenDocRef).docRef;
        const link = (tok as IAnnotationTokenLink).link;
        const text = (tok as IAnnotationTokenText).text;
        if (docRef)
            return <Link to={`/doc/${docRef}`} key={key} >
                <span className={css.link}>
                    {this.props.graph[docRef].title}
                </span>
            </Link>
        else if (link)
            return <a className={css.externallink} href={link} key={key} >{text}</a>;
        else
            return <span key={key} >{text}</span>
    }

    public render(): JSX.Element {
        const classNames: string[] = [css.annotation];
        const containerClassNames: string[] = [css.annotationcontainer];
        if (this.props.hover.docParts) {
            if (this.props.hover.docParts.indexOf(this.props.annotation.anchor) >= 0) {
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
                {this.props.annotation.tokens.map((tok, i) => this.renderToken(tok, i))}
            </div>;
    }
}

const mapStateToProps = (state: IAppState, ownProps) => ({
    annotation: ownProps.annotation,
    hover: state.hover,
    focus: state.focus,
    graph: state.docs.graph
});

export default connect(mapStateToProps, { setHover })(withRouter(Annotation));
