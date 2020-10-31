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
import { connect } from "react-redux";

import { setSideBarOpen } from "../../actions";
import { IAppState } from "../../model";
import NavTree from "./NavTree";

const drawerWidth = "20em";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: "flex",
    },
    drawer: {
      [theme.breakpoints.up("md")]: {
        width: drawerWidth,
        flexShrink: 0,
        zIndex: 1099, // under appbar when persistent
      },
    },
    // necessary for content to be below app bar
    toolbar: theme.mixins.toolbar,
    drawerPaper: {
      width: drawerWidth,
    },
  })
);

interface IProps {
  isSideBarOpen: boolean;
  setSideBarOpen: typeof setSideBarOpen;
}

function LeftSideBar(props: IProps) {
  const classes = useStyles();
  const theme = useTheme();
  const drawer = (
    <div>
      <div className={classes.toolbar} />
      <Divider />
      <NavTree />
    </div>
  );

  return (
    <div className={classes.root}>
      <nav className={classes.drawer} aria-label="mailbox folders">
        {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
        <Hidden mdUp implementation="css">
          <Drawer
            variant="temporary"
            anchor={theme.direction === "rtl" ? "right" : "left"}
            open={props.isSideBarOpen}
            onClose={() => props.setSideBarOpen(false)}
            classes={{
              paper: classes.drawerPaper,
            }}
            ModalProps={{
              keepMounted: true, // Better open performance on mobile.
            }}
          >
            {drawer}
          </Drawer>
        </Hidden>
        <Hidden smDown implementation="css">
          <Drawer
            classes={{
              paper: classes.drawerPaper,
            }}
            variant="permanent"
            open
          >
            {drawer}
          </Drawer>
        </Hidden>
      </nav>
    </div>
  );
}

const mapStateToProps = (state: IAppState) => ({
  isSideBarOpen: state.ui.navPaneOpen,
});

export default connect(mapStateToProps, { setSideBarOpen })(LeftSideBar);
