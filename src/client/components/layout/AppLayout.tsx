import { Theme, createStyles, makeStyles, useTheme } from "@material-ui/core";
import * as React from "react";
import ScrollMemory from "react-router-scroll-memory";

import AppBar from "./AppBar";
import LeftSideBar from "./LeftSideBar";
import RightSideBar from "./RightSideBar";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {},
    horizontal: {
      display: "flex",
    },
    content: {
      flexGrow: 1,
      padding: theme.spacing(2),
      [theme.breakpoints.down("sm")]: {
        // appbar offset
        marginTop: 40,
      },
      [theme.breakpoints.up("sm")]: {
        marginTop: 60,
      },
    },
  })
);

const AppLayout: React.FunctionComponent = (props) => {
  const classes = useStyles();
  const theme = useTheme();
  return (
    <div className={classes.root}>
      <AppBar />
      <div className={classes.horizontal}>
        <LeftSideBar />
        <main id="app-content" className={classes.content}>
          <ScrollMemory elementID="app-content" />
          {props.children}
        </main>
        <RightSideBar />
      </div>
    </div>
  );
};

export default AppLayout;
