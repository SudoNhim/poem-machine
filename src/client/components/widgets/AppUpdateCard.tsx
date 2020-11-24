import {
  Button,
  Card,
  CardActions,
  CardContent,
  Link,
  Theme,
  Typography,
  makeStyles,
} from "@material-ui/core";
import TimeAgo from "javascript-time-ago";
import en from "javascript-time-ago/locale/en";
import * as React from "react";
import { connect } from "react-redux";
import { Link as RouterLink } from "react-router-dom";
import ReactTimeAgo from "react-time-ago";

import { IAppUpdate, IDocGraph } from "../../../shared/ApiTypes";
import { IAppState } from "../../model";

TimeAgo.addLocale(en);

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
    backgroundColor: theme.palette.grey[100],
  },
  bullet: {
    display: "inline-block",
    margin: "0 2px",
    transform: "scale(0.8)",
  },
  title: {
    fontSize: 14,
  },
}));

interface IProps {
  graph: IDocGraph;
  update: IAppUpdate;
}

const AppUpdateCard: React.FunctionComponent<IProps> = (props) => {
  const classes = useStyles();

  let title: string;
  let content: string;
  let destination: string;
  let isExternalLink: boolean;
  if (props.update.kind === "deployment") {
    title = "Deployment";
    content = "The application re-deployed with updates.";
    destination = "https://github.com/SudoNhim/poem-machine/commits/master";
    isExternalLink = true;
  } else if (props.update.kind === "chat") {
    title = "Chat activity";
    content = `${props.update.count} new messages`;
    destination = `/chat`;
    isExternalLink = false;
  } else {
    let actionDesc: string;
    switch (props.update.action.kind) {
      case "addAnnotation":
        title = "Annotation added";
        actionDesc = "added an annotation to";
        break;
      case "editAnnotation":
        title = "Annotation edited";
        actionDesc = "edited an annotation on";
        break;
      case "deleteAnnotation":
        title = "Annotation deleted";
        actionDesc = "deleted an annotation on";
    }

    const docTitle = props.graph[props.update.action.documentId].title;
    const docKind = props.graph[props.update.action.documentId].kind;
    content = `User ${props.update.user} ${actionDesc} ${docKind} ${docTitle}`;
    destination = `/doc/${props.update.action.documentId}#${props.update.action.anchor}`;
    isExternalLink = false;
  }

  return (
    <Card className={classes.root}>
      <CardContent>
        <Typography className={classes.title} color="textSecondary">
          <ReactTimeAgo date={new Date(props.update.time)} locale="en-US" />
        </Typography>
        <Typography variant="h6" component="h2">
          {title}
        </Typography>
        <Typography variant="body2" component="div">
          {content}
        </Typography>
      </CardContent>
      <CardActions>
        {isExternalLink ? (
          <Button component={Link} href={destination} target="_blank">
            Open
          </Button>
        ) : (
          <Button component={RouterLink} to={destination}>
            Open
          </Button>
        )}
      </CardActions>
    </Card>
  );
};

const mapStateToProps = (state: IAppState, ownProps) => ({
  graph: state.docs.graph,
  update: ownProps.update,
});

export default connect(mapStateToProps)(AppUpdateCard);
