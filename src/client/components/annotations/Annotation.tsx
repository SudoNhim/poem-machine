import { Divider, Typography, makeStyles } from "@material-ui/core";
import * as React from "react";

import { IAnnotation } from "../../../shared/IApiTypes";
import ContentToken from "../shared/ContentToken";

const useStyles = makeStyles({
  content: {
    fontSize: 14,
  },
  contentContainer: {
    paddingTop: 10,
    paddingBottom: 10,
  },
  highlight: {
    backgroundColor: "lightyellow",
  },
  previewTag: {
    color: "darkblue",
    fontSize: 14,
    textAlign: "center",
    marginBottom: 5,
  },
  userTag: {
    color: "grey",
    fontSize: 14,
  },
});

interface IProps {
  annotation: IAnnotation;
  isPreview: boolean;
}

const Annotation: React.FunctionComponent<IProps> = (props) => {
  const classes = useStyles();

  const containerClasses = props.isPreview
    ? [classes.contentContainer, classes.highlight]
    : [classes.contentContainer];

  return (
    <React.Fragment>
      <Divider />
      <div className={containerClasses.join(" ")}>
        {props.isPreview && (
          <Typography className={classes.previewTag}>preview</Typography>
        )}
        <Typography
          className={classes.userTag}
          color="textSecondary"
          component="span"
        >
          {props.annotation.user || "anonymous"}:&nbsp;
        </Typography>
        <Typography className={classes.content} component="span">
          {props.annotation.content.map((tok, i) => (
            <ContentToken token={tok} key={i} />
          ))}
        </Typography>
      </div>
    </React.Fragment>
  );
};

export default Annotation;
