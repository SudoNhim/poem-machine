import { Theme, makeStyles } from "@material-ui/core";
import { Fragment } from "cohen-db/schema";
import * as React from "react";

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    display: "inline",
    borderRadius: theme.shape.borderRadius,
    border: "1px solid lightgrey",
  },
}));

interface IProps {
  fragments: Fragment[];
}

const FragmentsEditor: React.FunctionComponent<IProps> = (props) => {
  const classes = useStyles();

  const fragments = props.fragments.map((frag, i) => {
    if (frag.kind === "lineBreak") {
      return (
        <React.Fragment key={i}>
          <div className={classes.root}>⏎</div>
          <br />
        </React.Fragment>
      );
    } else {
      return (
        <div className={classes.root} key={i}>
          {frag.tokens.map((tok) =>
            tok.kind === "reference" ? tok.reference : tok.text
          )}
        </div>
      );
    }
  });
  return <div>{fragments}</div>;
};

export default FragmentsEditor;
