import { Theme, Typography, makeStyles } from "@material-ui/core";
import { Fragment } from "cohen-db/schema";
import * as React from "react";
import { RouteComponentProps, withRouter } from "react-router";

import TokenView from "./TokenView";

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    display: "inline",
    padding: theme.spacing(0.3),
  },
  selectable: {
    cursor: "pointer",
    "&:hover": {
      background: "lightgrey",
    },
  },
  selected: {
    background: "lightyellow",
    cursor: "pointer",
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

interface IProps extends RouteComponentProps {
  fragment: Fragment;
  sectionId?: string;
}

const FragmentView: React.FunctionComponent<IProps> = (props) => {
  const classes = useStyles();

  const frag = props.fragment;
  if (frag.kind === "lineBreak") {
    return <br />;
  } else if (frag.id) {
    const fullId = props.sectionId ? `${props.sectionId}/${frag.id}` : frag.id;
    const isSelected = props.location.hash.split("/")[0] === `#${fullId}`;
    const handleClick = (evt: React.MouseEvent<HTMLDivElement>) => {
      evt.stopPropagation();
      if (isSelected) {
        props.history.push(`${props.location.pathname}`);
      } else {
        props.history.push(`${props.location.pathname}#${fullId}/notes`);
      }
    };

    return (
      <div
        id={fullId}
        className={
          isSelected
            ? `${classes.root} ${classes.selected}`
            : `${classes.root} ${classes.selectable}`
        }
        onClick={(evt) => handleClick(evt)}
      >
        {
          <Typography
            className={classes.idLabel}
            display="inline"
            component="div"
          >
            {frag.id}
          </Typography>
        }
        {frag.tokens.map((tok, i) => (
          <TokenView token={tok} key={i} />
        ))}
      </div>
    );
  } else {
    return (
      <div className={classes.root}>
        {frag.tokens.map((tok, i) => (
          <TokenView token={tok} key={i} />
        ))}
      </div>
    );
  }
};

export default withRouter(FragmentView);
