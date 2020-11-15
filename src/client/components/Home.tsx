import { Paper, Theme, Typography, makeStyles } from "@material-ui/core";
import * as React from "react";

import { IAppStatistics, IAppUpdate } from "../../shared/IApiTypes";
import { getFeed, getStatistics } from "../api";

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    padding: theme.spacing(2),
  },
  feedItem: {
    padding: theme.spacing(1),
    marginBottom: theme.spacing(2),
    backgroundColor: theme.palette.grey[100],
  },
}));

const Home: React.FunctionComponent = () => {
  const classes = useStyles();

  const [statistics, setStatistics] = React.useState<IAppStatistics>();
  React.useEffect(() => {
    const fetchStats = async () => setStatistics(await getStatistics());
    fetchStats();
  }, []);

  const [feed, setFeed] = React.useState<IAppUpdate[]>();
  React.useEffect(() => {
    const fetchFeed = async () => setFeed(await getFeed());
    fetchFeed();
  }, []);

  const renderUpdate = (update: IAppUpdate) => {
    let title: string;
    let content: string;
    if (update.kind === "deployment") {
      title = "Deployment";
      content = "The application re-deployed with updates.";
    } else if (update.kind === "chat") {
      title = "Chat activity";
      content = `${update.count} new messages`;
    } else {
      title = `Annotation ${update.operation}`;
      content = `User ${update.user} ${update.operation}ed an annotation to ${update.target}#${update.anchor}`;
    }

    const datePart = update.time.split("T")[0];
    const dt = new Date(update.time);
    const timePart = `${dt
      .getHours()
      .toString()
      .padStart(2, "0")}:${dt.getMinutes().toString().padStart(2, "0")}`;

    return (
      <Paper className={classes.feedItem}>
        <Typography color="textSecondary">{`${datePart} ${timePart}`}</Typography>
        <Typography variant="h6">{title}</Typography>
        <Typography>{content}</Typography>
      </Paper>
    );
  };

  return (
    <Paper className={classes.root}>
      <Typography variant="h5" gutterBottom>
        Welcome to Leonard Cohen Notes
      </Typography>
      <Typography variant="body1" gutterBottom>
        A simple mission: to be the world's best resource for analyzing Leonard
        Cohen's lyrics.
      </Typography>
      <Typography variant="h6" gutterBottom>
        Statistics
      </Typography>
      <Typography variant="body1" gutterBottom>
        {statistics ? `${statistics.documentsCount} documents` : "Loading..."}
      </Typography>
      <Typography variant="body1" gutterBottom>
        {statistics ? `${statistics?.stubsCount} document stubs` : "Loading..."}
      </Typography>
      <Typography variant="body1" gutterBottom>
        {statistics
          ? `${statistics?.annotationsCount} annotations`
          : "Loading..."}
      </Typography>
      <Typography variant="body1" gutterBottom>
        {statistics
          ? `${statistics?.usersCount} registered users`
          : "Loading..."}
      </Typography>
      <Typography variant="body1" gutterBottom>
        {statistics
          ? `${statistics?.chatMessagesCount} chat messages`
          : "Loading..."}
      </Typography>
      <Typography variant="h6" gutterBottom>
        Activity Feed
      </Typography>
      {feed ? (
        feed
          .reverse()
          .map((update, i) => <div key={i}>{renderUpdate(update)}</div>)
      ) : (
        <Typography variant="body1" gutterBottom>
          Loading...
        </Typography>
      )}
    </Paper>
  );
};

export default Home;
