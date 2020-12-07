import { useMediaQuery } from "@material-ui/core";
import Divider from "@material-ui/core/Divider";
import Drawer from "@material-ui/core/Drawer";
import Hidden from "@material-ui/core/Hidden";
import {
  Theme,
  createStyles,
  makeStyles,
  useTheme,
} from "@material-ui/core/styles";
import React from "react";

import AnnotationsView from "../annotations/AnnotationsView";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    drawerWidthSmall: {
      width: "70%",
      backgroundColor: "#f5f5f5",
      paddingLeft: theme.spacing(2),
    },
    drawerWidth: {
      border: "none",
      backgroundColor: "transparent",
      [theme.breakpoints.between("sm", "md")]: {
        // left collapsed
        width: "calc(70% - 200px)",
      },
      [theme.breakpoints.up("md")]: {
        // neither collapsed
        width: "calc(70% - 400px)",
      },
    },
    drawer: {
      [theme.breakpoints.up("sm")]: {
        flexShrink: 0,
        zIndex: 1099, // under appbar when persistent
      },
    },
    // necessary for content to be below app bar
    toolbar: theme.mixins.toolbar,
  })
);

interface IProps {
  isOpen: boolean;
  onClose: () => void;
}

function RightSideBar(props: IProps) {
  const classes = useStyles();
  const theme = useTheme();
  const drawer = (
    <div>
      <div className={classes.toolbar} />
      <Divider />
      <AnnotationsView />
    </div>
  );

  const isSmall = useMediaQuery(theme.breakpoints.down("xs"));

  return (
    <nav
      className={`${classes.drawer} ${classes.drawerWidth}`}
      aria-label="mailbox folders"
    >
      {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
      <Hidden smUp implementation="css">
        <Drawer
          variant="temporary"
          anchor="right"
          elevation={0}
          open={props.isOpen && isSmall}
          onClose={() => props.onClose()}
          classes={{
            paper: classes.drawerWidthSmall,
          }}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
        >
          {drawer}
        </Drawer>
      </Hidden>
      <Hidden xsDown implementation="css">
        <Drawer
          classes={{
            paper: classes.drawerWidth,
          }}
          variant="permanent"
          anchor="right"
          open
        >
          {drawer}
        </Drawer>
      </Hidden>
    </nav>
  );
}

export default RightSideBar;
