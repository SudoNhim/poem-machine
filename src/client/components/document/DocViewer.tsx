import { Paper, Typography } from "@material-ui/core";
import * as React from "react";
import { RouteComponentProps, withRouter } from "react-router";

import { IDoc, IDocMeta } from "../../../shared/ApiTypes";
import ContentView from "./ContentView";
import DocReferencePreview from "./DocReferencePreview";
import MetadataView from "./MetadataView";

const css = require("./docviewer.css");

interface IProps extends RouteComponentProps {
  id: string;
  doc: IDoc;
  docMeta: IDocMeta;
}

interface IState {
  hasContentDom: boolean;
}

class DocViewer extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.state = {
      hasContentDom: false,
    };
  }

  public componentDidMount() {
    if (!this.state.hasContentDom) this.setState({ hasContentDom: true });
  }

  private onClick(evt: React.MouseEvent) {
    evt.stopPropagation();
    const base = `/doc/${this.props.id}`;
    if (this.props.location.hash) this.props.history.push(base);
  }

  public render() {
    if (!this.props.docMeta) return <div>Document does not exist.</div>;
    else if (!this.props.doc)
      return (
        <div>
          <div className={css.section + " " + css.heading}>
            {this.props.docMeta.title}
          </div>
          Loading...
        </div>
      );
    else
      return (
        <div>
          <Paper className={css.section} onClick={(evt) => this.onClick(evt)}>
            <Typography variant="h6" component="h2">
              {this.props.docMeta.title}
            </Typography>
            {this.props.doc.file.metadata && (
              <MetadataView metadata={this.props.doc.file.metadata} />
            )}
            {this.props.doc.file.content && (
              <ContentView content={this.props.doc.file.content} />
            )}
          </Paper>
          {this.props.doc.children && (
            <div className={css.section}>
              <div className={css.sectiontitle}>Children</div>
              {this.props.doc.children.map((child, i) => (
                <DocReferencePreview preview={child} key={i} />
              ))}
            </div>
          )}
          {this.props.doc.referrers && (
            <div className={css.section}>
              <div className={css.sectiontitle}>References</div>
              {this.props.doc.referrers.map((referrer, i) => (
                <DocReferencePreview preview={referrer} key={i} />
              ))}
            </div>
          )}
        </div>
      );
  }
}

export default withRouter(DocViewer);
