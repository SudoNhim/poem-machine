import { Theme, createStyles, makeStyles, useTheme } from "@material-ui/core";
import * as React from "react";
import { RouteComponentProps, withRouter } from "react-router";
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
      display: "flex",
      maxWidth: "100%",
      flexGrow: 1,
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
    contentNormal: {
      flexDirection: "row",
    },
    contentReverse: {
      flexDirection: "column-reverse",
      height: "100vh",
    },
  })
);

interface IProps extends RouteComponentProps {}

const AppLayout: React.FunctionComponent<IProps> = (props) => {
  const classes = useStyles();

  // The left sidepane is controlled with stateful toggle,
  // whereas the right sidepane is open when the URL fragment ends with '/notes'
  const [sideBarOpen, setSideBarOpen] = React.useState<
    "NONE" | "LEFT" | "RIGHT"
  >("NONE");

  React.useEffect(() => {
    if (props.location.hash.endsWith("/notes")) setSideBarOpen("RIGHT");
    else if (sideBarOpen === "RIGHT") setSideBarOpen("NONE");
  }, [props.location.hash]);

  const onRightClose = () => {
    // Removes the hash fragment
    props.history.replace(props.location.pathname);
  };

  const isChatPane = props.location.pathname.endsWith("/chat");
  const contentClasses = `${classes.content} ${
    isChatPane ? classes.contentReverse : classes.contentNormal
  }`;

  return (
    <div className={classes.root}>
      <AppBar openSideBar={() => setSideBarOpen("LEFT")} />
      <div className={classes.horizontal}>
        <LeftSideBar
          isOpen={sideBarOpen === "LEFT"}
          onClose={() => setSideBarOpen("NONE")}
        />
        <main id="app-content" className={contentClasses}>
          <ScrollMemory elementID="app-content" />
          {props.children}
        </main>
        <RightSideBar
          isOpen={sideBarOpen === "RIGHT"}
          onClose={() => onRightClose()}
        />
      </div>
    </div>
  );
};

export default withRouter(AppLayout);
