import { Paper, Theme, Typography, makeStyles } from "@material-ui/core";
import * as React from "react";

import { IAppStatistics } from "../../shared/IApiTypes";
import { getStatistics } from "../api";

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    flex: 1,
    padding: theme.spacing(2),
  },
}));

const Home: React.FunctionComponent = () => {
  const classes = useStyles();

  const [statistics, setStatistics] = React.useState<IAppStatistics>();
  React.useEffect(() => {
    const fetchStats = async () => setStatistics(await getStatistics());
    fetchStats();
  }, []);

  return (
    <Paper className={classes.root}>
      <Typography variant="h5" gutterBottom>
        Welcome to Leonard Cohen Notes
      </Typography>
      <Typography variant="body1" gutterBottom>
        This site has a simple mission: to be the world's best resource for
        analyzing Leonard Cohen's lyrics.
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
        Feed
      </Typography>
    </Paper>
  );
};

export default Home;
