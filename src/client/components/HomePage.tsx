import { Link, Paper, Theme, Typography, makeStyles } from "@material-ui/core";
import * as React from "react";

import { IAppStatistics, IAppUpdate } from "../../shared/ApiTypes";
import { getFeed, getStatistics } from "../api";
import AppUpdateCard from "./widgets/AppUpdateCard";

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    padding: theme.spacing(2),
  },
}));

const HomePage: React.FunctionComponent = () => {
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
        Activity Feed
      </Typography>
      {feed ? (
        feed
          .map((el) => el)
          .reverse()
          .map((update, i) => <AppUpdateCard update={update} key={i} />)
      ) : (
        <Typography variant="body1" gutterBottom>
          Loading...
        </Typography>
      )}
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
        Contact
      </Typography>
      <Typography variant="body1" gutterBottom>
        For all inquiries you can use the chat feature, or message{" "}
        <Link component="a" href="https://twitter.com/cohenmachine">
          cohenmachine
        </Link>{" "}
        on twitter, or{" "}
        <Link component="a" href="mailto:brenton.a.milne@gmail.com">
          email me
        </Link>
        . Collaborators welcome!
      </Typography>
    </Paper>
  );
};

export default HomePage;
