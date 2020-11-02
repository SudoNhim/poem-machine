import {
  Card,
  CardContent,
  Divider,
  Typography,
  makeStyles,
} from "@material-ui/core";
import * as React from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";

import {
  IAnnotation,
  IAnnotationTokenDocRef,
  IAnnotationTokenLink,
  IAnnotationTokenText,
  IAnnotationsGroup,
  IDocGraph,
} from "../../../shared/IApiTypes";
import { IAppState, IHoverState } from "../../model";

const useStyles = makeStyles({
  root: {
    marginTop: 20,
    marginRight: 16,
    marginBottom: 16,
  },
  contentContainer: {
    paddingTop: 10,
    paddingBottom: 10,
  },
  content: {
    fontSize: 14,
  },
  userTag: {
    color: "grey",
    fontSize: 14,
  },
  title: {
    fontSize: 16,
  },
  link: {
    textDecoration: "underline",
  },
  externalLink: {
    textDecoration: "underline",
    color: "darkblue",
  },
});

interface IProps {
  annotationsGroup: IAnnotationsGroup;
  hover: IHoverState;
  graph: IDocGraph;
}

const AnnotationsGroup: React.FunctionComponent<IProps> = (props) => {
  const classes = useStyles();

  const renderToken = (
    tok: IAnnotationTokenText | IAnnotationTokenLink | IAnnotationTokenDocRef,
    key: number
  ) => {
    const docRef = (tok as IAnnotationTokenDocRef).docRef;
    const link = (tok as IAnnotationTokenLink).link;
    const text = (tok as IAnnotationTokenText).text;
    if (docRef)
      return (
        <Link
          to={`/doc/${docRef}`}
          key={key}
          onClick={(e) => e.stopPropagation()}
        >
          <span className={classes.link}>
            {props.graph[docRef] ? (
              props.graph[docRef].title
            ) : (
              <span style={{ color: "red" }}>{docRef}</span>
            )}
          </span>
        </Link>
      );
    else if (link)
      return (
        <a
          className={classes.externalLink}
          href={link}
          onClick={(e) => e.stopPropagation()}
          key={key}
        >
          {text}
        </a>
      );
    else return <span key={key}>{text}</span>;
  };

  const renderAnnoContent = (anno: IAnnotation, key: number): JSX.Element => (
    <React.Fragment>
      <Divider key={-1 - key} />
      <div className={classes.contentContainer}>
        <Typography
          className={classes.userTag}
          color="textSecondary"
          component="span"
        >
          {anno.user}:&nbsp;
        </Typography>
        <Typography className={classes.content} key={key} component="span">
          {anno.content.map((tok, i) => renderToken(tok, i))}
        </Typography>
      </div>
    </React.Fragment>
  );

  return (
    <Card className={classes.root}>
      <CardContent>
        <Typography className={classes.title} color="textSecondary">
          {props.annotationsGroup.snippet}
        </Typography>
        {props.annotationsGroup.annotations.map((anno, i) =>
          renderAnnoContent(anno, i)
        )}
      </CardContent>
    </Card>
  );
};

const mapStateToProps = (state: IAppState, ownProps) => ({
  annotationGroup: ownProps.annotationGroup,
  hover: state.hover,
  graph: state.docs.graph,
});

export default connect(mapStateToProps)(AnnotationsGroup);
