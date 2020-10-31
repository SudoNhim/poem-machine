import { Theme, createStyles, makeStyles, useTheme } from "@material-ui/core";
import * as React from "react";
import ScrollMemory from "react-router-scroll-memory";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: "flex",
    },
  })
);

const ContentContainer: React.FunctionComponent = (props) => {
  const classes = useStyles();
  const theme = useTheme();
  return (
    <div id="viewpane" className={classes.root}>
      <ScrollMemory elementID="viewpane" />
      {props.children}
    </div>
  );
};

export default ContentContainer;
