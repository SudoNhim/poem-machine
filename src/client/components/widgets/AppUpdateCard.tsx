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
import * as React from "react";
import { connect } from "react-redux";
import { Link as RouterLink } from "react-router-dom";

import { IAppUpdate, IDocGraph } from "../../../shared/IApiTypes";
import { IAppState } from "../../model";

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
    title = `Annotation ${props.update.operation}`;
    const docTitle = props.graph[props.update.target].title;
    const docKind = props.graph[props.update.target].kind;
    content = `User ${props.update.user} ${props.update.operation}ed an annotation to ${docKind} ${docTitle}`;
    destination = `/doc/${props.update.target}#${props.update.anchor}`;
    isExternalLink = false;
  }

  const datePart = props.update.time.split("T")[0];
  const dt = new Date(props.update.time);
  const timePart = `${dt
    .getHours()
    .toString()
    .padStart(2, "0")}:${dt.getMinutes().toString().padStart(2, "0")}`;
  const dateTimeString = `${datePart} ${timePart}`;

  return (
    <Card className={classes.root}>
      <CardContent>
        <Typography className={classes.title} color="textSecondary">
          {dateTimeString}
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
