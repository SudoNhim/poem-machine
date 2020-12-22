import {
  Button,
  Card,
  CardActions,
  CardContent,
  Typography,
  makeStyles,
} from "@material-ui/core";
import * as React from "react";
import { connect } from "react-redux";
import { Link as RouterLink } from "react-router-dom";

import { IDocMeta, IDocReferencePreview } from "../../../shared/ApiTypes";
import { SerializeDocRef } from "../../../shared/util";
import { IAppState } from "../../model";
import FragmentView from "./FragmentView";

const useStyles = makeStyles({
  root: {
    marginTop: 10,
    marginBottom: 10,
  },
  bullet: {
    display: "inline-block",
    margin: "0 2px",
    transform: "scale(0.8)",
  },
  title: {
    fontSize: 14,
  },
});

interface IProps {
  docMeta: IDocMeta;
  preview: IDocReferencePreview;
}

const DocReferencePreview: React.FunctionComponent<IProps> = (props) => {
  const kind = props.docMeta.kind;
  const prefix = `${kind.charAt(0).toUpperCase()}${kind.substr(1)}`;
  const refstr = SerializeDocRef(props.preview.docRef);

  const classes = useStyles();
  return (
    <Card className={classes.root}>
      <CardContent>
        <Typography className={classes.title} color="textSecondary">
          {prefix}
        </Typography>
        <Typography variant="h6" component="h2">
          {props.docMeta.title}
        </Typography>
        <Typography variant="body2" component="div">
          {props.preview.preview.map((frag, i) => (
            <FragmentView fragment={frag} interactive={false} key={i} />
          ))}
        </Typography>
      </CardContent>
      <CardActions>
        <Button component={RouterLink} to={`/doc/${refstr}`}>
          Open
        </Button>
      </CardActions>
    </Card>
  );
};

const mapStateToProps = (state: IAppState, ownProps) => ({
  docMeta: state.docs.graph[ownProps.preview.docRef.documentId],
  preview: ownProps.preview,
});

export default connect(mapStateToProps)(DocReferencePreview);
