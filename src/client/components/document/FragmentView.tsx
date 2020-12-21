import { Theme, Typography, makeStyles } from "@material-ui/core";
import { Fragment } from "cohen-db/schema";
import * as React from "react";

import TokenView from "./TokenView";

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    display: "inline",
    padding: theme.spacing(0.3),
    "&:hover": {
      background: "lightgrey",
      cursor: "pointer",
    },
  },
  idLabel: {
    display: "inline-block",
    marginRight: 8,
    width: 20,
    textAlign: "right",
    fontSize: 14,
    fontWeight: "bold",
    color: theme.palette.text.disabled,
  },
}));

interface IProps {
  fragment: Fragment;
}

const FragmentView: React.FunctionComponent<IProps> = (props) => {
  const classes = useStyles();

  const frag = props.fragment;
  if (frag.kind === "lineBreak") {
    return <br />;
  } else {
    return (
      <div className={classes.root}>
        {frag.id && (
          <Typography
            className={classes.idLabel}
            display="inline"
            component="div"
          >
            {frag.id}
          </Typography>
        )}
        {frag.tokens.map((tok, i) => (
          <TokenView token={tok} key={i} />
        ))}
      </div>
    );
  }
};

export default FragmentView;
