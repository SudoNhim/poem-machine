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
import { connect } from "react-redux";

import { IAnnotation } from "../../../shared/IApiTypes";
import { setSideBarOpen } from "../../actions";
import { IAppState, SideBarOpen } from "../../model";
import AnnotationsView from "../docviewer/AnnotationsView";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    drawerWidthSmall: {
      width: "70%",
    },
    drawerWidth: {
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
  annotations: IAnnotation[];
  sideBarOpen: SideBarOpen;
  setSideBarOpen: typeof setSideBarOpen;
}

function RightSideBar(props: IProps) {
  const classes = useStyles();
  const theme = useTheme();
  const drawer = (
    <div>
      <div className={classes.toolbar} />
      <Divider />
      Right annos Drawer {JSON.stringify(props)}
      <AnnotationsView annotations={props.annotations} />
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
          open={props.sideBarOpen === SideBarOpen.right && isSmall}
          onClose={() => props.setSideBarOpen(SideBarOpen.none)}
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

const mapStateToProps = (state: IAppState) => ({
  annotations: state.focus.annotations,
  sideBarOpen: state.ui.sideBarOpen,
});

export default connect(mapStateToProps, { setSideBarOpen })(RightSideBar);
