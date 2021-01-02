import { Theme, makeStyles } from "@material-ui/core";
import { TextFragment } from "cohen-db/schema";
import * as React from "react";

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    display: "inline",
    borderRadius: theme.shape.borderRadius,
    border: "1px solid lightgrey",
  },
}));

interface IProps {
  value: TextFragment;
}

const SectionTitleEditor: React.FunctionComponent<IProps> = (props) => {
  const classes = useStyles();

  return (
    <div>
      {props.value.tokens
        .map((tok) =>
          tok.kind === "reference" ? tok.reference.documentId : tok.text
        )
        .join("")}
    </div>
  );
};

export default SectionTitleEditor;
