import { Theme, createStyles, makeStyles, useTheme } from "@material-ui/core";
import * as React from "react";
import ScrollMemory from "react-router-scroll-memory";

import AppBar from "./AppBar";
import LeftSideBar from "./LeftSideBar";
import RightSideBar from "./RightSideBar";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      backgroundColor: "#f5f5f5",
    },
    horizontal: {
      display: "flex",
    },
    content: {
      flexGrow: 1,
      flexDirection: "row",
      minHeight: "100vh",
      padding: theme.spacing(2),
      [theme.breakpoints.down("sm")]: {
        // appbar offset
        paddingTop: 60,
      },
      [theme.breakpoints.up("sm")]: {
        paddingTop: 71,
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
